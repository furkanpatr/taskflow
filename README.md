# TASKFLOW - Görev ve Proje Yönetim Sistemi

TASKFLOW, Node.js ve Express.js kullanılarak geliştirilmiş bir REST API projesidir.

Yazılım şirketlerinde görevlerin oluşturulmasını, çalışanlara atanmasını ve takip edilmesini sağlar.

## Özellikler

- Görev oluşturma, listeleme, görüntüleme, güncelleme ve silme
- Logger Middleware
- Validation Middleware
- Durum ve önceliğe göre filtreleme
- Görev başlığına göre arama

## Kurulum ve Çalıştırma

### 1. Projeyi bilgisayarına indir

GitHub üzerinden projeyi indir veya klonla.

### 2. Proje klasörüne gir

```bash
cd taskflow
```

### 3. Bağımlılıkları yükle

```bash
npm install
```

### 4. Sunucuyu başlat

```bash
node server.js
```

Sunucu başarıyla başladığında:

```text
TASKFLOW API 3000 portunda çalışıyor.
```

### 5. API'yi test et

Sunucu çalışırken Postman üzerinden aşağıdaki adrese GET isteği gönder:

```text
http://localhost:3000/tasks
```

Başarılı yanıtın HTTP durum kodu `200 OK` olacaktır.

## API Endpointleri

| Metot  | Endpoint     | Açıklama                 |
| :----- | :----------- | :----------------------- |
| POST   | `/tasks`     | Yeni görev oluşturur     |
| GET    | `/tasks`     | Tüm görevleri listeler   |
| GET    | `/tasks/:id` | ID'ye göre görev getirir |
| PUT    | `/tasks/:id` | Görevi günceller         |
| DELETE | `/tasks/:id` | Görevi siler             |

### Filtreleme ve Arama

Görevler durumlarına ve önceliklerine göre filtrelenebilir.

- `GET /tasks?status=pending`
- `GET /tasks?priority=high`
- `GET /tasks?search=login`

Filtreleme ve arama parametreleri birlikte kullanılabilir.

Örnek:

`GET /tasks?status=pending&priority=high&search=login`

## Örnek Görev Oluşturma

**İstek:** `POST /tasks`

**Gönderilecek JSON:**

```json
{
  "title": "Login API gelistir",
  "description": "Kullanici giris islemlerini hazirla",
  "assignee": "Ahmet",
  "priority": "high"
}
```

**Başarılı yanıt — 201 Created:**

```json
{
  "id": 1,
  "title": "Login API gelistir",
  "description": "Kullanici giris islemlerini hazirla",
  "assignee": "Ahmet",
  "status": "pending",
  "priority": "high"
}
```

Görev oluşturulurken `id` otomatik belirlenir ve `status` alanına varsayılan olarak `pending` atanır.

## Proje Klasör Yapısı

```text
taskflow/
├── controllers/
│   └── taskController.js
├── data/
│   └── tasks.js
├── middleware/
│   ├── logger.js
│   └── taskValidation.js
├── routes/
│   └── taskRoutes.js
├── docs/
│   ├── proje-tanitimi.md
│   └── proje-tanitimi.pdf
├── screenshots/
├── postman/
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

## Testler ve Dokümantasyon

TASKFLOW API, Postman kullanılarak test edilmiştir.

### Test Edilen İşlemler

- POST /tasks — Görev oluşturma
- GET /tasks — Görev listeleme
- GET /tasks/:id — Görev detayını görüntüleme
- PUT /tasks/:id — Görev güncelleme
- DELETE /tasks/:id — Görev silme
- GET /tasks/:id — Silinen görev için 404 kontrolü

Test sonuçlarının ekran görüntüleri `screenshots/` klasöründe bulunmaktadır.

### Proje Dokümantasyonu

Projenin amacı, kullanılan teknolojiler, temel özellikler ve sistem mimarisi aşağıdaki dosyalarda açıklanmıştır:

- `docs/proje-tanitimi.md`
- `docs/proje-tanitimi.pdf`

### Veri Saklama

Bu sürümde veritabanı kullanılmamaktadır. Görevler bellekte saklanır ve sunucu yeniden başlatıldığında kayıtlar sıfırlanır.
