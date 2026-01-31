# AI 코딩 가이드: Dexie 데이터 모델링

이 가이드는 `src/lib/client/backend/dexiejs` 디렉토리 내에서 새로운 테이블과 데이터 모델을 생성할 때 따라야 할 **필수적인 디렉토리 구조와 코딩 규칙**을 정의합니다.

새로운 테이블을 추가할 때는 반드시 아래의 **"폴더 기반 구조 (Folder-Based Structure)"**를 준수해야 합니다.

## 1. 디렉토리 및 파일 구조 (Directory & File Structure)

Dexie에 새로운 테이블(Table)을 추가하려면, `dexiejs` 폴더 아래에 **테이블 이름과 동일한 폴더**를 만들고 그 안에 `_.ts` 파일을 생성합니다.

### 규칙
1.  **폴더 생성**: 테이블 이름(영문 소문자, kebab-case 권장)으로 폴더를 생성합니다. 예: `posts`, `todo_items`
2.  **파일 생성**: 해당 폴더 안에 `_.ts` 파일을 생성합니다. 이 파일이 해당 테이블의 모델 정의 및 Dexie 연동 로직을 포함합니다.
3.  **클래스 명명**: 파일 내부의 클래스 이름은 폴더 이름을 **PascalCase**로 변환하여 사용합니다. 예: `posts` -> `Post`

### 구조 예시
```
src/lib/client/backend/dexiejs/
├── posts/              <-- 새로운 테이블 폴더 (예: 게시글)
│   └── _.ts            <-- 모델 정의 및 Dexie 로직 (Class Post)
├── authors/            <-- 새로운 테이블 폴더 (예: 작성자)
│   └── _.ts            <-- 모델 정의 및 Dexie 로직 (Class Author)
```

### 1.1 중첩 클래스 구조 (Nested Class Structure)

데이터 모델이 복잡해져서 **중첩 클래스(Nested Class)**가 필요한 경우, 부모 테이블 폴더 하위에 **`sub` 폴더**를 만들고 그 안에 파일을 생성합니다.

#### 규칙
1.  **`sub` 폴더 생성**: 부모 폴더 아래에 `sub` 폴더를 생성합니다.
2.  **파일 생성**: `sub` 폴더 안에 **클래스 이름(camelCase)**으로 파일을 생성합니다. (예: `address.ts`, `userProfile.ts`)
    *   **주의**: 중첩 클래스는 `_.ts`가 아니라 **구체적인 파일명**을 가집니다.

#### 구조 예시
```
src/lib/client/backend/dexiejs/
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
src/lib/client/backend/dexiejs/
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
1.  **String**: 기본 문자열
2.  **Number**: 숫자
3.  **Boolean**: 참/거짓
4.  **Float**: 실수 (Number와 동일하지만 명시적 처리)
5.  **Date**: 날짜 객체
6.  **String Array**: 단순 문자열 배열
7.  **Object (Map)**: JSON 객체
8.  **Nested Class**: 중첩된 모델 객체
9.  **Class Array**: 중첩된 모델 객체의 배열
10. **Enum**: 열거형 타입

### A. `toDataString()` 구현 가이드 (URL 전송용)

모든 데이터는 문자열로 변환되어야 합니다.

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

### C. `toMap()` 구현 가이드 (Dexie 저장용)

IndexDB 저장을 위해 직렬화합니다. `Boolean`은 0/1로, `Date`는 Timestamp(Number)로 변환하는 것이 핵심입니다.
**주의**: Manager 클래스(`...Dexie`)에서 접근해야 하므로 `public`이어야 합니다.

```typescript
/**
 * @internal Manager Class 전용 (직접 호출 지양)
 */
toMap(): object {
  return {
    // 1. String
    s: this.s,
    
    // 2. Number
    i: this.i,
    
    // 3. Boolean (DB 최적화를 위해 0 또는 1로 저장)
    b: this.b ? 1 : 0,
    
    // 4. Float
    f: this.f,
    
    // 5. Date (Sort/Filter를 위해 Timestamp Number로 저장)
    d: this.d.getTime(),
    
    // 6. String Array
    l: JSON.stringify(this.l),
    
    // 7. Object/Map
    m: JSON.stringify(this.m),
    
    // 8. Nested Class (URL용 문자열로 변환하여 저장)
    c: this.c.toDataString(),
    
    // 9. Class Array (각 요소를 문자열로 변환 후 JSON 배열로 저장)
    j: JSON.stringify(this.j.map((item) => item.toDataString())),
    
    // 10. Enum
    e: this.e,
    
    docId: this.docId,
  };
}
```

### D. `static fromMap()` 구현 가이드 (Dexie 복원용)

IndexedDB에서 꺼낸 데이터를 객체로 복원합니다.
**주의**: Manager 클래스(`...Dexie`)에서 접근해야 하므로 `public`이어야 합니다.

```typescript
/**
 * @internal Manager Class 전용 (직접 호출 지양)
 */
static fromMap(data: any): Post {
  const object = new Post();

  // 1. String
  object.s = data.s || "";

  // 2. Number
  object.i = Number(data.i || 0);

  // 3. Boolean (0/1 -> false/true)
  object.b = data.b === 1;

  // 4. Float
  object.f = Number(data.f || 0.0);

  // 5. Date (Timestamp -> Date)
  object.d = new Date(data.d || 0);

  // 6. String Array
  object.l = JSON.parse(data.l || "[]");

  // 7. Object/Map
  object.m = JSON.parse(data.m || "{}");

  // 8. Nested Class
  object.c = Other.fromDataString(
      data.c || new Other().toDataString()
  );

  // 9. Class Array
  object.j = (JSON.parse(data.j || "[]") || [])
      .map((item: string) => Other.fromDataString(item));

  // 10. Enum
  object.e = EnumHelper.fromString(data.e || Enum.Default);

  object.docId = data.docId;

  return object;
}
```

---

## 2.1 중첩 클래스 구현 규칙 (Nested Class Rules)

**중첩 클래스(Nested Class)**는 독립적인 테이블이 아니므로 일반 모델 클래스와 **다른 규칙**이 적용됩니다.

### 핵심 규칙
1.  **`docId` 제외**: DB에 독립적으로 저장되지 않으므로 `docId` 필드를 가지지 않습니다.
2.  **Manager Class 제외**: `...Dexie` 클래스(Manager)를 만들지 않습니다.
3.  **필수 메서드**:
    *   `toDataString()`: **필수 구현** (부모 객체의 데이터 직렬화 과정에서 사용됨)
    *   `static fromDataString()`: **필수 구현** (부모 객체의 데이터 복원 과정에서 사용됨)
    *   `toMap()` / `fromMap()`: **구현하지 않음** (부모의 JSON 필드로 저장되므로 불필요)

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

## 3. Dexie 관리 클래스 구현 (Dexie Manager Class)

데이터 접근을 담당하는 정적(static) 클래스(`ClassName + Dexie`)는 아래의 **표준 CRUD 패턴**을 반드시 구현해야 합니다.

### 표준 구현 예시 (`PostDexie`)

```typescript
export class PostDexie {
  static db: Dexie;
  static isReady = false;

  // 0. 초기화
  static async ready() {
    if (PostDexie.isReady) return;
    PostDexie.db = new Dexie("Post"); // DB 이름 = 클래스 이름
    PostDexie.db.version(1).stores({
      Post: "docId, s, i" // 인덱스: docId 필수, 필요한 필드 추가
    });
    PostDexie.isReady = true;
  }

  // 1. Insert (생성)
  static async insert(object: Post) {
    await PostDexie.db.table("Post").add(object.toMap());
  }

  // 2. Update (수정)
  static async update(object: Post) {
    await PostDexie.db.table("Post").update(object.docId, object.toMap());
  }

  // 3. Upsert (생성 또는 수정)
  // docId로 조회 후 없으면 insert, 있으면 update
  static async upsert(object: Post) {
    if ((await PostDexie.get(object.docId)) === null) {
      await PostDexie.insert(object);
    } else {
      await PostDexie.update(object);
    }
  }

  // 4. Delete (삭제)
  static async delete(docId: string) {
    await PostDexie.db.table("Post").delete(docId);
  }

  // 5. Get (조회)
  // 데이터가 없으면 null 반환
  static async get(docId: string): Promise<Post | null> {
    const row = await PostDexie.db.table("Post").get(docId);
    return row ? Post.fromMap(row) : null;
  }

  // 6. Get All (전체 조회)
  static async getAll(): Promise<Post[]> {
    const rows = await PostDexie.db.table("Post").toArray();
    return rows.map((row) => Post.fromMap(row));
  }
  
  // 7. Reset (테이블 초기화 - 디버그/테스트용)
  static async resetTable() {
    await PostDexie.db.table("Post").clear();
  }
}
```

---

## 4. 커스텀 함수 구현 가이드 (Custom Functions)

표준 CRUD 외에 **필터링 조회, 특정 필드 업데이트, 대량 조회** 등 유연한 기능을 추가할 때의 구현 가이드입니다.

### 핵심 원칙
1.  **반환 타입(Return Type)**: 항상 **DTO 클래스(`Post`)** 또는 **DTO 배열(`Post[]`)**을 반환해야 합니다. Raw Object를 그대로 반환하지 마십시오. (`fromMap` 사용 필수)
2.  **색인(Index) 활용**: `.where()`를 사용할 때는 반드시 `stores()`에 정의된 인덱스만 사용해야 성능이 보장됩니다.
3.  **인덱스 부재 시 추가 (Index Addition)**:
    *   만약 `.where("category")`와 같이 특정 필드로 조회가 필요한데 해당 필드가 인덱스로 정의되어 있지 않다면, **반드시 `ready()` 메서드의 `stores` 정의에 해당 필드를 추가**해야 합니다.
    *   예: `Post: "docId, title"` -> `Post: "docId, title, category"`
    *   주의: Dexie는 스토어 스키마가 변경되면 자동으로 버전을 관리해주지 않으므로, 개발 단계에서는 편하게 추가하되 배포 시에는 마이그레이션 전략이 필요할 수 있습니다. (현재 템플릿은 단순 추가 권장)

### 예시 패턴

#### A. 조건부 조회 (Filtering)
특정 조건에 맞는 데이터를 리스트로 반환합니다.

```typescript
// 예: 카테고리별 게시글 조회
static async getByCategory(category: string): Promise<Post[]> {
  // .where()를 사용하여 인덱스 검색
  const rows = await PostDexie.db.table("Post")
    .where("category").equals(category)
    .toArray();
    
  // 반드시 fromMap을 통해 객체로 변환하여 반환
  return rows.map(row => Post.fromMap(row));
}

// 예: 완료되지 않은 항목만 조회 (Boolean 필드 0/1 활용)
static async getActiveTodos(): Promise<Todo[]> {
  const rows = await TodoDexie.db.table("Todo")
    .where("isDone").equals(0) // false는 DB에 0으로 저장됨
    .toArray();

  return rows.map(row => Todo.fromMap(row));
}
```

#### B. 특정 필드 부분 업데이트 (Partial Update)
객체 전체를 덮어쓰지 않고 특정 필드만 수정합니다.

```typescript
// 예: 게시글 제목만 수정
static async updateTitle(docId: string, newTitle: string) {
  await PostDexie.db.table("Post").update(docId, {
    title: newTitle
  });
}

// 예: 조회수 1 증가
static async incrementViewCount(docId: string) {
  const post = await PostDexie.get(docId);
  if (post) {
    await PostDexie.db.table("Post").update(docId, {
      viewCount: post.viewCount + 1
    });
  }
}
```

#### C. 페이지네이션 (Pagination)
대량의 데이터를 끊어서 가져옵니다.

```typescript
static async getRecentPosts(limit: number): Promise<Post[]> {
  const rows = await PostDexie.db.table("Post")
    .reverse() // 최신순
    .limit(limit)
    .toArray();
    
  return rows.map(row => Post.fromMap(row));
}
```


