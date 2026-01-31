// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {

	declare namespace App {
		// interface Error {}
		interface Locals {}
		// interface PageData {}
		interface Platform {
			env: {
				// WorkerKV 바인딩 예시 — 실제 바인딩 이름으로 교체하세요
				// MY_KV: KVNamespace;
			};
			context: {
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage & { default: Cache }
		}

		interface Session {}

		interface Stuff {}
	}
}

export {};
