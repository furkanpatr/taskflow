# TASKFLOW - Görev ve Proje Yönetim Sistemi

## 1. Projenin Amacı

TASKFLOW, yazılım şirketlerinde görevlerin ve çalışan sorumluluklarının düzenli şekilde yönetilmesini amaçlayan REST API tabanlı bir backend projesidir.

Sistem; görev oluşturma, görevleri listeleme, detaylarını görüntüleme, güncelleme ve silme işlemlerini destekler. Görevler çalışanlara atanabilir, durumları ve öncelikleri takip edilebilir.

Proje, Node.js ve Express.js kullanılarak geliştirilmiştir. Ayrıca gelen HTTP isteklerini kaydeden Logger Middleware, veri doğrulama mekanizması, görev filtreleme ve arama özellikleri bulunmaktadır.

## 2. Kullanılan Teknolojiler

TASKFLOW projesinin geliştirilmesinde aşağıdaki teknolojiler kullanılmıştır:

- **Node.js:** JavaScript kodlarının sunucu tarafında çalıştırılmasını sağlar.
- **Express.js:** REST API endpoint'lerinin ve HTTP isteklerinin yönetilmesini sağlar.
- **JavaScript (CommonJS):** Backend geliştirmesinde kullanılan programlama dili ve modül sistemidir.
- **Postman:** API isteklerini test etmek ve sonuçlarını doğrulamak için kullanılmıştır.
- **Visual Studio Code:** Projenin geliştirildiği kod editörüdür.

Projenin mevcut sürümünde veriler JavaScript dizisinde, geçici olarak bellekte tutulmaktadır. Bu nedenle sunucu yeniden başlatıldığında görev kayıtları silinir.

## 3. Sistemin Temel Özellikleri

TASKFLOW, görevlerin oluşturulmasını ve yönetilmesini sağlayan aşağıdaki özellikleri sunmaktadır:

- **Görev oluşturma:** Başlık, açıklama, sorumlu çalışan ve öncelik bilgileriyle yeni görev oluşturulması.
- **Görev listeleme:** Sistemdeki bütün görevlerin görüntülenmesi.
- **Görev detayı:** Görevlerin ID bilgisine göre görüntülenmesi.
- **Görev güncelleme:** Görev bilgilerinin, durumunun ve önceliğinin değiştirilmesi.
- **Görev silme:** Sistemde bulunan görevlerin silinmesi.
- **Logger Middleware:** HTTP isteklerinin metot, endpoint ve zaman bilgilerinin kaydedilmesi.
- **Validation Middleware:** Hatalı veya eksik görev bilgilerinin kontrol edilmesi.
- **Filtreleme:** Görevlerin durumlarına ve önceliklerine göre listelenmesi.
- **Arama:** Görev başlıklarında anahtar kelimeyle arama yapılması.

Görev durumları `pending`, `in_progress` ve `completed`; öncelik seviyeleri ise `low`, `medium` ve `high` olarak belirlenmiştir.

## 4. API Endpointleri

TASKFLOW REST API, görev yönetimi için aşağıdaki endpoint'leri sunmaktadır:

| HTTP Metodu | Endpoint     | Açıklama                                |
| :---------- | :----------- | :-------------------------------------- |
| POST        | `/tasks`     | Yeni görev oluşturur.                   |
| GET         | `/tasks`     | Görevleri listeler.                     |
| GET         | `/tasks/:id` | Belirtilen görevin detaylarını getirir. |
| PUT         | `/tasks/:id` | Görev bilgilerini günceller.            |
| DELETE      | `/tasks/:id` | Belirtilen görevi siler.                |

Görev listeleme endpoint'i ayrıca sorgu parametrelerini destekler:

- `?status=pending` — Duruma göre filtreleme.
- `?priority=high` — Önceliğe göre filtreleme.
- `?search=login` — Görev başlığına göre arama.

Bu parametreler birlikte de kullanılabilir.

API yerel geliştirme ortamında `http://localhost:3000` adresinde çalışmaktadır.

## 5. Sistem Mimarisi ve Çalışma Mantığı

TASKFLOW, Node.js ve Express.js kullanılarak katmanlı bir dosya yapısıyla geliştirilmiştir.

Projenin temel bileşenleri:

- **server.js:** Express sunucusunu başlatır ve middleware ile route bağlantılarını yönetir.
- **routes/taskRoutes.js:** HTTP isteklerini ilgili Controller fonksiyonlarına yönlendirir.
- **controllers/taskController.js:** Görev oluşturma, listeleme, detay görüntüleme, güncelleme, silme, filtreleme ve arama işlemlerini gerçekleştirir.
- **data/tasks.js:** Görevlerin geçici olarak saklandığı JavaScript dizisini içerir.
- **middleware/logger.js:** Gelen HTTP isteklerinin metot, endpoint ve zaman bilgilerini konsola kaydeder.
- **middleware/taskValidation.js:** Görev oluşturma ve güncelleme işlemlerinde gönderilen verileri doğrular.

**Sistemin çalışma mantığı:**

Postman üzerinden gönderilen HTTP isteği önce Express sunucusuna ulaşır. Logger Middleware isteği kaydeder. Router, isteği ilgili endpoint'e yönlendirir. POST ve PUT isteklerinde Validation Middleware verileri kontrol eder. Kontrol başarılıysa Controller ilgili işlemi gerçekleştirir ve sonucu JSON formatında döndürür.

Projenin mevcut sürümünde veritabanı kullanılmamaktadır. Görevler bellekte tutulduğu için sunucu yeniden başlatıldığında kayıtlar sıfırlanır.
