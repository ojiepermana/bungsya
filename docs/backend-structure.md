# Backend Project Structure Guideline
## Bun + ElysiaJS

Tujuan struktur ini adalah:

- Mudah dipahami oleh developer baru.
- Mudah dipelihara dalam jangka panjang.
- Mudah dipecah menjadi microservice apabila suatu saat diperlukan.
- Seluruh business logic terpisah dari HTTP layer.
- Mendukung API First, OpenAPI, Testing, Background Job, dan Dependency Injection.
- Tidak bergantung pada ORM tertentu.

────────────────────────────────────────────────────────────

src/
│
├── main.ts
├── app.ts
│
├── config/
│   ├── env.ts
│   ├── database.ts
│   └── cors.ts
│
├── shared/
│   ├── errors/
│   │   ├── app-error.ts
│   │   └── error-handler.ts
│   │
│   ├── utils/
│   │
│   ├── types/
│   │
│   └── plugins/
│       ├── auth.plugin.ts
│       ├── logger.plugin.ts
│       └── openapi.plugin.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.route.ts
│   │   ├── auth.schema.ts
│   │   ├── auth.service.ts
│   │   └── auth.repository.ts
│   │
│   ├── users/
│   │   ├── users.route.ts
│   │   ├── users.schema.ts
│   │   ├── users.service.ts
│   │   └── users.repository.ts
│   │
│   └── customers/
│       ├── customers.route.ts
│       ├── customers.schema.ts
│       ├── customers.service.ts
│       └── customers.repository.ts
│
├── database/
│   ├── client.ts
│   ├── migrations/
│   └── seeds/
│
├── jobs/
│   └── example.job.ts
│
└── tests/
    └── users.test.ts

────────────────────────────────────────────────────────────
main.ts
────────────────────────────────────────────────────────────

Entry point aplikasi.

Tanggung jawab:

- Load environment
- Membuat App
- Menjalankan HTTP Server
- Graceful Shutdown

JANGAN berisi:

- Route
- Business Logic
- SQL
- Validasi

────────────────────────────────────────────────────────────
app.ts
────────────────────────────────────────────────────────────

Tempat merakit seluruh aplikasi.

Berisi:

- Global Plugin
- Middleware
- Error Handler
- OpenAPI
- Swagger
- Semua Module

Contoh urutan:

Config

↓

Plugins

↓

Middleware

↓

Routes

↓

Error Handler

────────────────────────────────────────────────────────────
config/
────────────────────────────────────────────────────────────

Berisi seluruh konfigurasi aplikasi.

env.ts

- membaca .env
- validasi environment
- export typed config

database.ts

- konfigurasi database
- pool
- timeout
- retry

cors.ts

- konfigurasi CORS

Folder ini TIDAK BOLEH memiliki business logic.

────────────────────────────────────────────────────────────
shared/
────────────────────────────────────────────────────────────

Berisi kode yang dapat digunakan oleh seluruh module.

Tidak boleh berisi kode yang spesifik terhadap suatu module.

Contoh:

shared/

errors/

utils/

plugins/

types/

────────────────────────────────────────────────────────────
shared/errors/
────────────────────────────────────────────────────────────

Berisi custom exception.

Contoh:

ValidationError

NotFoundError

UnauthorizedError

ForbiddenError

ConflictError

InternalServerError

error-handler.ts

Global Error Handler Elysia.

Semua error harus melewati file ini.

────────────────────────────────────────────────────────────
shared/utils/
────────────────────────────────────────────────────────────

Utility yang reusable.

Contoh:

Date

UUID

Slug

Hash

Crypto

Random

Formatter

Parser

Jangan membuat util yang hanya dipakai satu module.

────────────────────────────────────────────────────────────
shared/types/
────────────────────────────────────────────────────────────

Shared TypeScript Types.

Contoh:

Pagination

ApiResponse

JWTPayload

RequestContext

────────────────────────────────────────────────────────────
shared/plugins/
────────────────────────────────────────────────────────────

Plugin Elysia yang reusable.

Contoh:

Authentication

Authorization

OpenAPI

Swagger

Logger

Rate Limiter

Tracing

Request ID

Compression

Security Header

────────────────────────────────────────────────────────────
modules/
────────────────────────────────────────────────────────────

Semua fitur aplikasi berada di folder ini.

Setiap folder merupakan satu bounded context kecil.

Contoh:

auth

users

customers

inventory

sales

invoice

payment

employee

dan seterusnya.

Masing-masing module memiliki dependency sendiri.

Jangan saling mengakses Repository module lain.

Komunikasi antar module dilakukan melalui Service.

────────────────────────────────────────────────────────────
module structure
────────────────────────────────────────────────────────────

auth/

auth.route.ts

auth.schema.ts

auth.service.ts

auth.repository.ts

────────────────────────────────────────────────────────────
route
────────────────────────────────────────────────────────────

Hanya bertugas:

- menerima HTTP Request
- validasi
- memanggil service
- mengembalikan response

Tidak boleh:

SQL

Business Logic

Perhitungan

Manipulasi Data

────────────────────────────────────────────────────────────
schema
────────────────────────────────────────────────────────────

Berisi:

Body

Query

Params

Headers

Cookies

Response Schema

Menggunakan TypeBox atau Standard Schema sesuai standar project.

────────────────────────────────────────────────────────────
service
────────────────────────────────────────────────────────────

Tempat seluruh Business Logic.

Contoh:

Validasi bisnis

Perhitungan

Workflow

Transaction

Integrasi service lain

Call external API

Repository hanya dipanggil dari Service.

────────────────────────────────────────────────────────────
repository
────────────────────────────────────────────────────────────

Hanya berisi akses database.

Tidak boleh ada:

Business Rule

HTTP

Validasi

Repository bertanggung jawab terhadap:

SELECT

INSERT

UPDATE

DELETE

Transaction Helper

Stored Procedure

Raw SQL

────────────────────────────────────────────────────────────
database/
────────────────────────────────────────────────────────────

client.ts

Membuat koneksi database.

Migrations/

Seluruh migration database.

Seeds/

Initial Data.

Folder ini tidak mengetahui business logic.

────────────────────────────────────────────────────────────
jobs/
────────────────────────────────────────────────────────────

Background Process.

Contoh:

Scheduler

Cron

Email Queue

Notification

Import

Export

Cleanup

Sync

Worker

Job tidak boleh dipanggil langsung oleh Route.

────────────────────────────────────────────────────────────
tests/
────────────────────────────────────────────────────────────

Berisi seluruh test.

Disarankan struktur mengikuti module.

Contoh:

tests/

users.test.ts

auth.test.ts

customers.test.ts

inventory.test.ts

Gunakan Bun Test.

────────────────────────────────────────────────────────────
Dependency Flow
────────────────────────────────────────────────────────────

HTTP Request

↓

Route

↓

Schema Validation

↓

Service

↓

Repository

↓

Database

↓

Repository

↓

Service

↓

HTTP Response

────────────────────────────────────────────────────────────
Dependency Rules
────────────────────────────────────────────────────────────

Route
    boleh memanggil
        Service

Service
    boleh memanggil
        Repository
        Shared

Repository
    boleh memanggil
        Database

Repository
    TIDAK boleh memanggil
        Service

Route
    TIDAK boleh memanggil
        Repository

Route
    TIDAK boleh memanggil
        Database

Schema
    TIDAK boleh memanggil
        Service

Schema
    TIDAK boleh memanggil
        Repository

Shared
    TIDAK boleh bergantung pada Module.

────────────────────────────────────────────────────────────
Naming Convention
────────────────────────────────────────────────────────────

Semua nama file menggunakan lowercase dan kebab-case.

Contoh:

customer.route.ts

customer.service.ts

customer.repository.ts

customer.schema.ts

Hindari:

CustomerService.ts

CustomerRepository.ts

myFile.ts

────────────────────────────────────────────────────────────
Scalability
────────────────────────────────────────────────────────────

Apabila suatu module menjadi besar, struktur dapat berkembang menjadi:

customers/

    api/
        route.ts
        schema.ts

    services/

    repositories/

    models/

    dto/

    events/

    workers/

    constants/

    mappers/

Tanpa mengubah struktur module lain.

Dengan pendekatan ini setiap module dapat berkembang secara independen tanpa memengaruhi keseluruhan project.

────────────────────────────────────────────────────────────
Architecture Principle
────────────────────────────────────────────────────────────

Presentation Layer
    Route

↓

Validation Layer
    Schema

↓

Business Layer
    Service

↓

Persistence Layer
    Repository

↓

Database

Setiap layer hanya mengetahui layer tepat di bawahnya (one-way dependency).

Tujuan akhirnya adalah menghasilkan backend yang modular, mudah diuji, mudah dipelihara, dan siap berkembang dari aplikasi kecil hingga sistem enterprise berskala besar.