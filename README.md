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

# API

### Users

 - **[POST] /users/authenticate** - Logowanie do panelu administratora
 Request: {
&nbsp;&nbsp;&nbsp;&nbsp;username: string,
&nbsp;&nbsp;&nbsp;&nbsp;password: string,
 }
 Response: {
&nbsp;&nbsp;&nbsp;&nbsp;id: number,
&nbsp;&nbsp;&nbsp;&nbsp;username: string,
&nbsp;&nbsp;&nbsp;&nbsp;token: string, //TOKEN JWT
 }

### Voting
 - **[POST] /voting/create** - Utworzenie ankiety
 Request: {
&nbsp;&nbsp;&nbsp;&nbsp;name: string,
&nbsp;&nbsp;&nbsp;&nbsp;questions: [{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: string,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: string,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;active: boolean,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;additionalData: string,
 &nbsp;&nbsp;&nbsp;&nbsp;}]
 }
 Response: null

 - **[POST] /voting/answer/{uuid}/{questionId}** - Zapisanie odpowiedzi na zadane pytanie
 &nbsp;
 Request: {
&nbsp;&nbsp;&nbsp;&nbsp;answerStr: string,
 }
 Response: null

 - **[GET] /voting** - Pobranie wszystkich ankiet zapisanych w systemie
 &nbsp;
 Response: [{
	&nbsp;&nbsp;&nbsp;&nbsp; id: number,
	 &nbsp;&nbsp;&nbsp;&nbsp; name: string,
	 &nbsp;&nbsp;&nbsp;&nbsp; questions: {
	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id: number,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: string,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: string,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;active: boolean,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;additionalData: string,
 &nbsp;&nbsp;&nbsp;&nbsp;}
 ]

 - **[POST] /voting/answer/{uuid}/{questionId}** - Zapisanie odpowiedzi na zadane pytanie
 &nbsp;
 Request: {
&nbsp;&nbsp;&nbsp;&nbsp;answerStr: string,
 }
 Response: null

 - **[GET] /voting/{votingId}/question/{questionId}/activate** - Aktywacja konkretnego pytania z wybranej ankiety
 &nbsp;
 Response: null

 - **[GET] /voting/{token}** - Pobranie ankiety wraz z aktywnym pytaniem po tokenie ankiety
 &nbsp;
  Response: {
	&nbsp;&nbsp;&nbsp;&nbsp; title: string,
	 &nbsp;&nbsp;&nbsp;&nbsp; question: {
	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id: number,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: string,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: string,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;active: boolean,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;additionalData: string,
 &nbsp;&nbsp;&nbsp;&nbsp;}
 }

 - **[GET] /voting/result/{token}** - Pobranie wyników ankiety po jej tokenie
 &nbsp;
  Response: {
	&nbsp;&nbsp;&nbsp;&nbsp; name: string,
	 &nbsp;&nbsp;&nbsp;&nbsp; questions: [{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: string,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: string,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;active: boolean,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;additionalData: string,
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;answers: [
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;value: string,
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],
 &nbsp;&nbsp;&nbsp;&nbsp;}]
 }


 - **[GET] /voting/link/{id}** - Generowanie linku z tokenem do ankiety
 &nbsp;
  Response: {
	&nbsp;&nbsp;&nbsp;&nbsp;uuid: string
 }