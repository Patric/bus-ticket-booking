# bus-ticket-booking
Google cloud, lambda functions, Firestore application
Patryk Sulej, Jakub Nabrdalik Programowanie usług w chmurze 2022

+ Link do filmu przedstawiającego działanie aplikacji: https://youtu.be/efsYhZqo3IA
+ Link z głębszym opisem https://youtu.be/w2xAnjbRCIw (na początku opis dotyczył diagramu poniżej - nie nagrało się)
+ Link do repozytorium z częścią klienta aplikacji: https://github.com/jnabrdalik/bus-tickets-client
+ Link do aplikacji: https://bus-tickets-2.ew.r.appspot.com/

W ramach projektu przygotowano aplikację webową do rezerwowania biletów autobusowych z wykorzystaniem platformy Google Cloud.

Początkowo jako bazę danych chcieliśmy wykorzystać SQL Server oraz usługę Cloud SQL, co z resztą nam się udało i pomyslnie mogliśmy połączyć się z instancją bazy danych jednak po miesiącu pracy zużyliśmy wszystkie fundusze i cała praca poszła na marne. 

Wyciągnęliśmy z tego wnioski i następnym razem wykorzystaliśmy darmową przestrzeń w Firebase przy uzyciu Firestore. 

![image](https://user-images.githubusercontent.com/55952226/149424023-1b14e9d2-8ad4-48ef-82f2-e897120f1215.png)

Ogólny schemat zależności poszczególnych części aplikacji widzimy powyżej.
Jako uwierzytelnienie zastosowaliśmy oauth, z google pobieramy dane o użytkownikach, następnie do tych danych przypisujemy dane zamówienie. Zamówienie może być imienne. Potem dzięki uwierzytelnieniu oauth możemy wysłać na email użytkownika maila z jego biletem. Niestety nie udało nam się zaimplementować załączania plików do maili, a gmail blokuje wyświetlanie obrazów base64 w mailu, więc kod QR zobacyzć można jedynie w naszej aplikacji, która zaprezentowana została na filmiku dołączonym do sprawozdania. Jako backend wykorzystaliśmy google functions oraz node js. Do autoryzacji bibliotekę passportJS oraz do przechowywania danych Firestore. Wszelkie klucze przechowywane są w repozytorium. W trakcie developmentu repozytorium było publiczne i bardzo szybko dane poufne zostały wykradzione, co także sprawiło nam problemy. Po kontakcie z supportem i przeniesiu kodu do repozytorium prywatnego udało się jednak z nimi poradzić. 
