# TASKFLOW — Veri Modeli ve API Tasarımı

**Proje:** TASKFLOW — Görev ve Proje Yönetim Sistemi  
**Teknolojiler:** Node.js, Express.js, JavaScript (CommonJS)  
**Kapsam:** Bitirme projesi Aşama 1 — İhtiyaç Analizi ve Sistem Tasarımı

## 1. Sistem Senaryosu ve Kapsam

TASKFLOW, bir yazılım şirketinin görevlerini, görevlere atanan çalışanları, görev durumlarını ve önceliklerini yönetmek için geliştirilmiş bir REST API'dir. Kullanıcılar görev oluşturabilir, bütün görevleri listeleyebilir, bir görevin detayını görebilir, görevi güncelleyebilir ve silebilir.

Mevcut uygulamada veriler veritabanında değil, `data/tasks.js` içindeki JavaScript dizisinde saklanır. Sunucu yeniden başladığında kayıtlar sıfırlanır. Ayrı bir çalışan veya proje CRUD modeli mevcut değildir; görev sorumlusu `assignee` alanında metin olarak tutulur.

## 2. Veri Modeli Tasarımı

Sistemin temel veri modeli **Task (Görev)** nesnesidir.

| Alan | Veri türü | Zorunluluk / kaynak | Açıklama |
|---|---|---|---|
| `id` | Number | Sunucu oluşturur | Görevin benzersiz sayısal kimliği. Bellekte `nextId` sayacıyla atanır. |
| `title` | String | POST ve PUT için zorunlu | Görev başlığı; boş veya yalnızca boşluk olamaz. |
| `description` | String | POST ve PUT için zorunlu | Görevin açıklaması; boş veya yalnızca boşluk olamaz. |
| `assignee` | String | POST ve PUT için zorunlu | Göreve atanan çalışanın adı; boş veya yalnızca boşluk olamaz. |
| `status` | String | POST'ta otomatik, PUT'ta zorunlu | Görevin mevcut durumu. |
| `priority` | String | POST ve PUT için zorunlu | Görevin öncelik düzeyi. |

**İzin verilen `status` değerleri:** `pending`, `in_progress`, `completed`.  
**İzin verilen `priority` değerleri:** `low`, `medium`, `high`.

POST işleminde `id` otomatik üretilir ve `status` değeri `pending` olarak atanır. POST gövdesinde `status` verilse bile Controller bu değeri kullanmaz. PUT işlemi, `id` haricindeki beş alanın tamamını günceller.

### Örnek Task nesnesi

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

## 3. API Tasarımı

**Yerel temel adres:** `http://localhost:3000`  
**Kaynak yolu:** `/tasks`  
**Veri biçimi:** JSON

| HTTP metodu | Endpoint | İşlev | Başarılı yanıt | Olası hata |
|---|---|---|---|---|
| POST | `/tasks` | Yeni görev oluşturur | `201 Created`, oluşturulan Task | `400 Bad Request` |
| GET | `/tasks` | Görevleri listeler; isteğe bağlı filtreleme ve arama uygular | `200 OK`, Task dizisi | `400 Bad Request` (tekrarlanan sorgu parametresi) |
| GET | `/tasks/:id` | ID ile tek görev getirir | `200 OK`, Task | `404 Not Found` |
| PUT | `/tasks/:id` | Görevin alanlarını günceller | `200 OK`, güncellenen Task | `400 Bad Request`, `404 Not Found` |
| DELETE | `/tasks/:id` | Görevi siler | `204 No Content`, boş gövde | `404 Not Found` |

Ek olarak `GET /` endpoint'i `{ "message": "TASKFLOW API calisiyor" }` yanıtını döndürür. Bilinmeyen rotalar `404` JSON yanıtı; bozuk JSON isteği ise `400` JSON yanıtı alır.

### POST /tasks — örnek istek

```json
{
  "title": "Login API gelistir",
  "description": "Kullanici giris islemlerini hazirla",
  "assignee": "Ahmet",
  "priority": "high"
}
```

**Örnek başarılı yanıt:** Yukarıdaki Task nesnesi (`id` ve varsayılan `status` dahil), HTTP `201`.

### PUT /tasks/:id — örnek istek

```json
{
  "title": "Login API tamamla",
  "description": "Login islemlerini test et",
  "assignee": "Mehmet",
  "status": "in_progress",
  "priority": "medium"
}
```

### GET /tasks — isteğe bağlı sorgu parametreleri

- `?status=pending` — Duruma göre filtreleme.
- `?priority=high` — Önceliğe göre filtreleme.
- `?search=login` — Görev başlığında büyük/küçük harf duyarsız arama.
- `?status=pending&priority=high&search=login` — Koşulları birlikte uygulama.

Filtreleme eşleşen görevleri döndürür; hiçbir görev eşleşmezse boş dizi (`[]`) döner. `status`, `priority` ve `search` sorgu parametrelerinin her biri tek bir metin değeri olmalıdır; tekrarlanarak dizi haline gelirse `400` döner. Listeleme sorgu parametrelerinin geçerli `status`/`priority` kümesinden olduğunu ayrıca doğrulamaz; eşleşme yoksa boş dizi döndürür.

## 4. İstek Akışı ve Doğrulama

1. HTTP isteği Express sunucusuna gelir.
2. **Logger Middleware** istek metodunu, orijinal URL'yi ve ISO zaman damgasını konsola yazar.
3. `express.json()` JSON gövdesini ayrıştırır.
4. `/tasks` Router isteği uygun endpoint'e yönlendirir.
5. POST/PUT işlemlerinde **Validation Middleware** zorunlu alanları, metin türünü, boşlukları ve izin verilen `priority`/`status` değerlerini kontrol eder.
6. Controller işlemi `tasks` dizisi üzerinde gerçekleştirir ve HTTP/JSON yanıtını oluşturur.

Eksik veya hatalı görev verileri için `400` JSON yanıtı verilir. Var olmayan görev kimliğinde `404` döner. Ayrı hata middleware'i, bozuk JSON ve tanımlanmamış rotalar için JSON yanıtları sağlar.

## 5. Tasarım Tercihleri ve Sınırlar

- Görev verileri bellek içi dizide saklanır; kalıcı veritabanı yoktur.
- Ayrı kullanıcı/çalışan yönetim endpoint'i yoktur; `assignee` metin alanıdır.
- PUT işlemi tam güncelleme mantığıyla tasarlanmıştır; `PATCH` endpoint'i bulunmaz.
- Filtreleme ve başlığa göre arama, PDF'deki zorunlu CRUD kapsamına ek olarak geliştirilmiş özelliklerdir.
- API kimlik doğrulaması, rol yönetimi ve raporlama sistemi bu sürümün kapsamında değildir.

**Kaynak dosyalar:** `server.js`, `routes/taskRoutes.js`, `controllers/taskController.js`, `middleware/taskValidation.js`, `middleware/logger.js`, `data/tasks.js`.  
**İlgili belgeler:** `docs/proje-tanitimi.md`, `docs/proje-tanitimi.pdf`, `README.md`.
