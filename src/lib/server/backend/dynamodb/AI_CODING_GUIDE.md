# AI 코딩 가이드: DynamoDB 데이터 모델링

이 가이드는 `src/lib/server/backend/dynamodb` 디렉토리 내에서 새로운 테이블과 데이터 모델을 생성할 때 따라야 할 **필수적인 디렉토리 구조와 코딩 규칙**을 정의합니다.

새로운 테이블을 추가할 때는 반드시 아래의 **"폴더 기반 구조 (Folder-Based Structure)"**를 준수해야 합니다.

## 1. 디렉토리 및 파일 구조 (Directory & File Structure)

DynamoDB에 새로운 테이블(Table)을 추가하려면, `dynamodb` 폴더 아래에 **테이블 이름과 동일한 폴더**를 만들고 그 안에 `_.ts` 파일을 생성합니다.

### 규칙
1.  **폴더 생성**: 테이블 이름(영문 소문자, kebab-case 권장)으로 폴더를 생성합니다. 예: `posts`, `user_profiles`
2.  **파일 생성**: 해당 폴더 안에 `_.ts` 파일을 생성합니다. 이 파일이 해당 테이블의 모델 정의 및 DynamoDB 연동 로직을 포함합니다.
3.  **클래스 명명**: 파일 내부의 클래스 이름은 폴더 이름을 **PascalCase**로 변환하여 사용합니다. 예: `posts` -> `Post`

### 구조 예시
```
src/lib/server/backend/dynamodb/
├── posts/              <-- 새로운 테이블 폴더 (예: 게시글)
│   └── _.ts            <-- 모델 정의 및 DynamoDB 로직 (Class Post)
├── users/              <-- 새로운 테이블 폴더 (예: 사용자)
│   └── _.ts            <-- 모델 정의 및 DynamoDB 로직 (Class User)
```

### 1.1 중첩 클래스 구조 (Nested Class Structure)

데이터 모델이 복잡해져서 **중첩 클래스(Nested Class)**가 필요한 경우, 부모 테이블 폴더 하위에 **`sub` 폴더**를 만들고 그 안에 파일을 생성합니다.

#### 규칙
1.  **`sub` 폴더 생성**: 부모 폴더 아래에 `sub` 폴더를 생성합니다.
2.  **파일 생성**: `sub` 폴더 안에 **클래스 이름(camelCase)**으로 파일을 생성합니다. (예: `address.ts`, `userProfile.ts`)
    *   **주의**: 중첩 클래스는 `_.ts`가 아니라 **구체적인 파일명**을 가집니다.

#### 구조 예시
```
src/lib/server/backend/dynamodb/
├── user/               <-- 부모 테이블 (User)
│   ├── _.ts            <-- User 모델 정의
│   └── sub/            <-- 중첩 클래스 모음 폴더 (sub)
│       ├── address.ts  <-- Nested Class (Address)
│       └── profile.ts  <-- Nested Class (Profile)
```

---

### 1.2 Enum 구조 (Enum Structure)

상태값이나 종류를 나타내는 **Enum(열거형)**이 필요한 경우, 부모 테이블 폴더 하위에 **`enums` 폴더**를 만들고 그 안에 파일을 생성합니다.

#### 규칙
1.  **`enums` 폴더 생성**: 부모 폴더 아래에 `enums` 폴더를 생성합니다.
2.  **파일 생성**: `enums` 폴더 안에 **Enum 이름을 snake_case**로 변환하여 파일을 생성합니다. (예: `user_role.ts`, `post_status.ts`)

#### 구조 예시
```
src/lib/server/backend/dynamodb/
├── user/               <-- 부모 테이블
│   ├── _.ts
│   ├── sub/            <-- 중첩 클래스
│   └── enums/          <-- Enum 모음 폴더
│       ├── user_role.ts <-- Enum 파일 (snake_case)
│       └── status.ts    <-- Enum 파일
```

---

## 2. 데이터 모델 클래스 구현 상세 가이드

`_.ts` 파일 내부의 DTO 클래스는 다음 4가지 메서드를 **반드시** 구현해야 합니다.
모든 메서드는 **9가지 핵심 데이터 타입**을 빠짐없이 처리해야 합니다.

### 처리해야 할 데이터 타입 목록
1.  **String**: 기본 문자열 (`{ S: value }`)
2.  **Number**: 숫자 (`{ N: value.toString() }`)
3.  **Boolean**: 참/거짓 (`{ N: '1' }` 또는 `{ N: '0' }`) - *DB 최적화를 위해 Number로 저장*
4.  **Float**: 실수 (`{ N: value.toString() }`)
5.  **Date**: 날짜 객체 (`{ N: timestamp.toString() }`)
6.  **String Array**: 단순 문자열 배열 (`{ S: JSON.stringify(list) }`)
7.  **Object (Map)**: JSON 객체 (`{ S: JSON.stringify(map) }`)
8.  **Nested Class**: 중첩된 모델 객체 (`{ S: obj.toDataString() }`)
9.  **Class Array**: 중첩된 모델 객체의 배열 (`{ S: JSON.stringify(list.map(x => x.toDataString())) }`)
10. **Enum**: 열거형 타입 (`{ S: value }`)

### A. `toDataString()` 구현 가이드 (URL 전송용)

모든 데이터는 문자열로 변환되어야 합니다. (Dexie 패턴과 동일)

```typescript
toDataString(): string {
  return btoa(
    Array.from(
      new TextEncoder().encode(
        new URLSearchParams({
          // 1. String
          s: this.s,
          
          // 2. Number (Int)
          i: this.i.toString(),
          
          // 3. Boolean
          b: this.b.toString(), // "true" or "false"
          
          // 4. Float
          f: this.f.toString(),
          
          // 5. Date (Timestamp String)
          d: this.d.getTime().toString(),
          
          // 6. String Array (JSON)
          l: JSON.stringify(this.l),
          
          // 7. Object/Map (JSON)
          m: JSON.stringify(this.m),
          
          // 8. Nested Class (재귀 호출)
          c: this.c.toDataString(),
          
          // 9. Class Array (리스트 각 요소를 재귀 호출 후 JSON)
          j: JSON.stringify(this.j.map((item) => item.toDataString())),
          
          // 10. Enum
          e: this.e,

          docId: this.docId,
        }).toString()
      )
    )
    .map((byte) => String.fromCharCode(byte))
    .join("")
  );
}
```

### B. `static fromDataString()` 구현 가이드 (URL 복원용)

URL 파라미터(String)에서 원래 타입으로 복원합니다.

```typescript
static fromDataString(dataString: string): Post {
  const queryParams = Object.fromEntries(
    new URLSearchParams(atob(dataString))
  );
  const object = new Post();

  // 1. String
  object.s = queryParams["s"] || "";

  // 2. Number (Int)
  object.i = parseInt(queryParams["i"] || "0", 10);

  // 3. Boolean
  object.b = queryParams["b"] === "true";

  // 4. Float
  object.f = parseFloat(queryParams["f"] || "0.0");

  // 5. Date
  object.d = new Date(parseInt(queryParams["d"] || "0", 10));

  // 6. String Array
  object.l = JSON.parse(queryParams["l"] || "[]");

  // 7. Object/Map
  object.m = JSON.parse(queryParams["m"] || "{}");

  // 8. Nested Class
  object.c = Other.fromDataString(
      queryParams["c"] || new Other().toDataString()
  );

  // 9. Class Array
  object.j = (JSON.parse(queryParams["j"] || "[]") || [])
      .map((item: string) => Other.fromDataString(item));

  // 10. Enum
  object.e = EnumHelper.fromString(queryParams["e"] || Enum.Default);

  object.docId = queryParams["docId"] || "";

  return object;
}
```

### C. `toDynamoItem()` 구현 가이드 (DynamoDB 저장용)

DynamoDB `PutItem`을 위해 Attribute Value 형식으로 직렬화합니다.
**주의**: Manager 클래스(`...DynamoDb`)에서 접근해야 하므로 `public`이어야 합니다.

```typescript
/**
 * @internal Manager Class 전용 (직접 호출 지양)
 */
toDynamoItem(): Record<string, any> {
  return {
    docId: { S: this.docId }, // Primary Key
    
    // 1. String
    s: { S: this.s },
    
    // 2. Number
    i: { N: this.i.toString() },
    
    // 3. Boolean (DB 최적화를 위해 0/1 Number로 저장)
    b: { N: (this.b ? 1 : 0).toString() },
    
    // 4. Float
    f: { N: this.f.toString() },
    
    // 5. Date (Sort/Filter를 위해 Timestamp Number로 저장)
    d: { N: this.d.getTime().toString() },
    
    // 6. String Array
    l: { S: JSON.stringify(this.l) },
    
    // 7. Object/Map
    m: { S: JSON.stringify(this.m) },
    
    // 8. Nested Class (URL용 문자열로 변환하여 저장)
    c: { S: this.c.toDataString() },
    
    // 9. Class Array (각 요소를 문자열로 변환 후 JSON 배열로 저장)
    j: { S: JSON.stringify(this.j.map((item) => item.toDataString())) },
    
    // 10. Enum
    e: { S: this.e },
  };
}
```

### D. `static fromDynamoItem()` 구현 가이드 (DynamoDB 복원용)

DynamoDB `GetItem` 결과(`Item`)에서 객체로 복원합니다.
**주의**: Manager 클래스(`...DynamoDb`)에서 접근해야 하므로 `public`이어야 합니다.

```typescript
/**
 * @internal Manager Class 전용 (직접 호출 지양)
 */
static fromDynamoItem(item: any): Post {
  const object = new Post();

  // Primary Key
  object.docId = item.docId?.S ?? "";

  // 1. String
  object.s = item.s?.S ?? "";

  // 2. Number
  object.i = Number(item.i?.N ?? "0");

  // 3. Boolean (0/1 -> false/true)
  object.b = Number(item.b?.N ?? "0") === 1;

  // 4. Float
  object.f = Number(item.f?.N ?? "0.0");

  // 5. Date (Timestamp -> Date)
  object.d = new Date(Number(item.d?.N ?? "0"));

  // 6. String Array
  object.l = JSON.parse(item.l?.S ?? "[]");

  // 7. Object/Map
  object.m = JSON.parse(item.m?.S ?? "{}");

  // 8. Nested Class
  object.c = Other.fromDataString(
      item.c?.S ?? new Other().toDataString()
  );

  // 9. Class Array
  object.j = (JSON.parse(item.j?.S ?? "[]") || [])
      .map((item: string) => Other.fromDataString(item));

  // 10. Enum
  object.e = EnumHelper.fromString(item.e?.S ?? Enum.Default);

  return object;
}
```

---

## 2.1 중첩 클래스 구현 규칙 (Nested Class Rules)

**중첩 클래스(Nested Class)**는 독립적인 테이블이 아니므로 일반 모델 클래스와 **다른 규칙**이 적용됩니다.

### 핵심 규칙
1.  **`docId` 제외**: DB에 독립적으로 저장되지 않으므로 `docId` 필드를 가지지 않습니다.
2.  **Manager Class 제외**: `...DynamoDb` 클래스(Manager)를 만들지 않습니다.
3.  **필수 메서드**:
    *   `toDataString()`: **필수 구현** (부모 객체의 데이터 직렬화 과정에서 사용됨)
    *   `static fromDataString()`: **필수 구현** (부모 객체의 데이터 복원 과정에서 사용됨)
    *   `toDynamoItem()` / `fromDynamoItem()`: **구현하지 않음** (부모의 JSON 문자열 필드로 저장되므로 불필요)

### 구현 예시 (`Address`)

```typescript
export class Address {
  // 1. String
  city: string = "";
  // 2. Number
  zipCode: number = 0;

  // 주의: docId 없음

  toDataString(): string {
    return btoa(
      Array.from(
        new TextEncoder().encode(
          new URLSearchParams({
            city: this.city,
            zipCode: this.zipCode.toString(),
          }).toString()
        )
      )
      .map((byte) => String.fromCharCode(byte))
      .join("")
    );
  }

  static fromDataString(dataString: string): Address {
    const queryParams = Object.fromEntries(
      new URLSearchParams(atob(dataString))
    );
    const object = new Address();

    object.city = queryParams["city"] || "";
    object.zipCode = parseInt(queryParams["zipCode"] || "0", 10);

    return object;
  }
}
```

---

## 2.2 Enum 구현 규칙 (Enum Rules)

**Enum**은 단순 값 정의뿐만 아니라, 안전한 타입 변환을 위해 **Helper 클래스**와 함께 정의해야 합니다.

### 핵심 규칙
1.  **Helper 클래스**: Enum 이름 뒤에 `Helper`를 붙인 클래스를 같은 파일에 `export` 합니다.
2.  **`fromString` 필수**: 문자열을 Enum으로 안전하게 변환하는 `static fromString` 메서드를 반드시 구현합니다.
3.  **유효성 검사**: `fromString` 내부에서 유효하지 않은 값이 들어오면 **에러를 발생(throw Error)**시켜야 합니다.

### 구현 예시 (`user_role.ts`)

```typescript
export enum UserRole {
  Admin = 'Admin',
  User = 'User',
  Guest = 'Guest',
}

export class UserRoleHelper {
  static fromString(enumString: string): UserRole {
    const values = Object.values(UserRole) as string[];
    if (values.includes(enumString)) {
      return enumString as UserRole;
    }
    throw new Error(`Invalid enum value: ${enumString}`);
  }
}
```

---

## 3. DynamoDB 관리 클래스 구현 (DynamoDB Manager Class)

데이터 접근을 담당하는 정적(static) 클래스(`ClassName + DynamoDb`)는 아래의 **표준 CRUD 패턴**을 반드시 구현해야 합니다.

### 표준 구현 예시 (`PostDynamoDb`)

```typescript
import { 
    DynamoDBClient, 
    CreateTableCommand, 
    PutItemCommand, 
    GetItemCommand, 
    DeleteItemCommand, 
    ScanCommand,
    ScalarAttributeType 
} from "@aws-sdk/client-dynamodb";
import { env } from '$env/dynamic/private';

export class PostDynamoDb {
  private static client: DynamoDBClient;

  // 0. 초기화 (Singleton Client)
  static readyDb(platform?: any) {
    if (this.client) return this.client;
    
    this.client = new DynamoDBClient({
        region: env.AWS_REGION || platform?.env?.AWS_REGION || 'ap-northeast-2',
        credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID || platform?.env?.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY || platform?.env?.AWS_SECRET_ACCESS_KEY || '',
        },
    });
    return this.client;
  }

  // 1. Create Table (테이블 생성 - PAY_PER_REQUEST)
  static async createTable(platform?: any) {
    this.readyDb(platform);
    const tableParams = {
        TableName: "Post",
        KeySchema: [{ AttributeName: "docId", KeyType: "HASH" as const }],
        AttributeDefinitions: [{ AttributeName: "docId", AttributeType: "S" as ScalarAttributeType }],
        BillingMode: "PAY_PER_REQUEST" as const,
    };

    try {
        await PostDynamoDb.client.send(new CreateTableCommand(tableParams));
        console.log("Post table created");
    } catch (err) {
        console.error("Post table creation failed:", err);
    }
  }

  // 2. Upsert (생성 또는 수정 - PutItem)
  static async upsert(object: Post, platform?: any) {
    this.readyDb(platform);
    
    const params = {
        TableName: "Post",
        Item: object.toDynamoItem()
    };

    await PostDynamoDb.client.send(new PutItemCommand(params));
  }

  // 3. Delete (삭제)
  static async delete(docId: string, platform?: any): Promise<boolean> {
    this.readyDb(platform);
    
    try {
        const result = await PostDynamoDb.client.send(new DeleteItemCommand({
            TableName: "Post",
            Key: { docId: { S: docId } },
            ReturnValues: "ALL_OLD"
        }));
        return !!result.Attributes;
    } catch (error) {
        console.error('Failed to delete item:', error);
        throw error;
    }
  }

  // 4. Get (조회)
  static async get(docId: string, platform?: any): Promise<Post | null> {
    this.readyDb(platform);
    
    const result = await PostDynamoDb.client.send(new GetItemCommand({
        TableName: "Post",
        Key: { docId: { S: docId } }
    }));

    if (result.Item) {
        return Post.fromDynamoItem(result.Item);
    }
    return null;
  }
  
  // 5. Get All (전체 조회 - Scan)
  // 주의: 데이터가 많을 경우 Scan은 비효율적이므로 Query 권장
  static async getAll(platform?: any): Promise<Post[]> {
    this.readyDb(platform);
    
    const result = await PostDynamoDb.client.send(new ScanCommand({
        TableName: "Post"
    }));

    return (result.Items || []).map(item => Post.fromDynamoItem(item));
  }
}
```
