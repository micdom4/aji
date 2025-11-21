## Wymagania na ocenę 3 (Podstawa)

Baza Danych (Struktura)

    [x] Tabela Kategoria

        [x] Pola: id, nazwa (tekst).

        [x] Struktura płaska (brak relacji rodzic-dziecko).

        [x] Seedowanie: Wypełnij tabelę predefiniowanymi kategoriami.

    [x] Tabela Stan_Zamowienia

        [ x Pola: id, nazwa (tekst).

        [x] Seedowanie: Dodaj stany: NIEZATWIERDZONE, ZATWIERDZONE, ANULOWANE, ZREALIZOWANE.

    x ] Tabela Produkt

        [x] Pola: id, nazwa (tekst), opis (tekst/HTML), cena_jednostkowa (decimal), waga_jednostkowa (decimal).

        [x] Relacja: Klucz obcy do tabeli Kategoria (obowiązkowe).

    [ ] Tabela Zamowienie

        [ ] Pola: id, data_zatwierdzenia (data, nullable), nazwa_uzytkownika, email, telefon.

        [ ] Opcjonalnie: stawka_vat, rabat.

        [ ] Relacja: Klucz obcy do tabeli Stan_Zamowienia (obowiązkowe).

    [ ] Tabela Zamowienie_Produkty (Szczegóły zamówienia)

        [ ] Pola: zamowienie_id, produkt_id, liczba_sztuk, cena_jednostkowa_w_momencie_zakupu.

API Endpoints (Serwer)

    [ ] Produkty

        [ ] GET /products – Lista wszystkich produktów.

        [ ] GET /products/:id – Szczegóły produktu.

        [ ] POST /products – Dodawanie produktu.

        [ ] PUT /products/:id – Aktualizacja produktu (oprócz ID).

    [ ] Kategorie

        [ ] GET /categories – Lista kategorii.

    [ ] Zamówienia

        [ ] GET /orders – Lista wszystkich zamówień.

        [ ] GET /orders/status/:id – Zamówienia według stanu.

        [ ] POST /orders – Dodanie zamówienia.

        [ ] PATCH /orders/:id – Zmiana stanu zamówienia (np. JSON PATCH lub PUT).

        [ ] Wyświetlanie zamówień konkretnego użytkownika (np. przez query param lub osobny endpoint).

    [ ] Stany Zamówienia

        [ ] GET /status – Lista możliwych stanów.

Walidacja i Logika Biznesowa

    [ ] Zainstaluj bibliotekę statusów: np. http-status-codes.

    [ ] Walidacja Produktu:

        [ ] Błąd przy ujemnej cenie/wadze.

        [ ] Błąd przy zerowej cenie/wadze.

        [ ] Błąd przy pustej nazwie lub opisie.

        [ ] Błąd przy edycji nieistniejącego ID.

    [ ] Walidacja Zamówienia:

        [ ] Błąd przy pustych/błędnych danych użytkownika (np. litery w telefonie).

        [ ] Błąd przy towarach nieistniejących w bazie.

        [ ] Błąd przy ujemnych/zerowych ilościach sztuk.

    [ ] Logika Stanów (Maszyna stanów):

        [ ] Blokada zmiany stanu, jeśli zamówienie jest ANULOWANE.

        [ ] Blokada cofania stanu (np. z ZREALIZOWANE na NIEZATWIERDZONE).

        [ ] Błąd przy aktualizacji nieistniejącego zamówienia.

    [ ] Obsługa błędów:

        [ ] Zwracanie jasnych komunikatów JSON z odpowiednim kodem HTTP (400, 404 itp.).

Testowanie (Tylko jeśli brak zadań dodatkowych)

    [ ] Postman: Utwórz kolekcję zapytań testującą każdy endpoint.

🤖 Wymaganie D1 (+0.5 oceny): SEO & AI

    [ ] Integracja AI: Skonfiguruj połączenie z modelem językowym (np. Groq, OpenAI) po stronie serwera.

    [ ] Endpoint: GET /products/:id/seo-description.

    [ ] Logika: Pobierz dane produktu z bazy -> Wyślij do AI -> Zwróć wygenerowany opis HTML.

🔐 Wymaganie D2 (+0.5 oceny): Uwierzytelnianie (JWT)

    [ ] Baza Danych: Dodaj tabelę użytkowników z rolami (KLIENT, PRACOWNIK).

    [ ] Endpoint: POST /login – Weryfikacja hasła i generowanie tokenu JWT (ważność np. 1h).

    [ ] Middleware: Zabezpiecz wrażliwe endpointy (wymagany nagłówek Authorization: Bearer ...).

    [ ] Logika: Mechanizm odświeżania tokenu (Refresh Token).

📦 Wymaganie D3 (+0.5 oceny): Import Danych

    [ ] Endpoint: POST /init.

    [ ] Logika:

        [ ] Przyjmuje dane (JSON lub CSV).

        [ ] Dodaje towary do bazy.

        [ ] Zwraca błąd, jeśli baza towarów nie jest pusta.

        [ ] Zabezpieczenie autoryzacją (jeśli zrobiono D2).

⭐ Wymaganie D4 (+0.5 oceny): Opinie

    [ ] Baza Danych: Tabela opinii powiązana z zamówieniem.

    [ ] Endpoint: POST /orders/:id/opinions.

    [ ] Logika:

        [ ] Przyjmuje ocenę (1-5) i treść.

        [ ] Sprawdza, czy zamówienie ma status ZREALIZOWANE lub ANULOWANE.

        [ ] Blokuje dodanie opinii do zamówień w trakcie realizacji.

        [ ] Zwraca kod 201 (sukces) lub 400 (błąd).
