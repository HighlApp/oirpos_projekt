# oirpos_projekt
Projekt na zaliczenie przedmiotu OIRPOS

# Założenia projektu

1. Kreator ankiet/głosowań (uproszczona wersja Google Forms)
2. Trzy rodzaje pytań (tak/nie, wybór jednej z wielu opcji, numeryczne)
3. Możliwość podglądu wyników głosowania na żywo (dla admina)
4. Wyniki dostępne dla uczestników głosowania, po zakończeniu głosowania (warunkiem jest udzielenie odpowiedzi na każde pytanie przez wszystkich uczestników ankiety).
5. Krokowe wypełnianie ankiet/głosowań
6. Generowanie linków do ankiety z tokenami
7. Aktywowanie pytań na żądanie admina

# Wykorzystane technologie
1. Backend: ASP.NET Core MVC, WebApi, Npgsql, JSON Web Tokens, LINQ
2. Frontend: ReactJS, Redux, React Router, HTML, CSS, JavaScript
3. Baza danych: PostgreSQL

Hi! I'm your first Markdown file in **StackEdit**. If you want to learn about StackEdit, you can read me. If you want to play with Markdown, you can edit me. Once you have finished with me, you can create new files by opening the **file explorer** on the left corner of the navigation bar.


# Konfiguracja środowiska
### Frontend
 - Z poziomu katalogu ..\voting-frontend (ten sam poziom co plik package.json) uruchomić z konsoli polecenie npm install (na jednostce musi być zainstalowany Node Package Manager oraz Node.js) w celu zainstalowania zależności projektu.
 - Po zainstalowaniu zależności, z tego samego katalogu uruchomić polecenie npm start
 - Aplikacja uruchomi się na porcie :3000.

### Backend

 - Wykonać skrypt z poleceniami sql, zawartymi w pliku initDb.sql, który znajduje się w katalogu sql w backendowym projekcie (baza PostgreSQL).
 - Uruchomić aplikację z profilem Development (Environment variable -> ASPNETCORE_ENVIRONMENT=Development)
 - Aplikacja uruchomi się na porcie :4000.

### Logowanie
Domyślnie po uruchomieniu aplikacji
Login: admin
Hasło: 1234
