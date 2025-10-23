
function handleCredentialResponse(response) {
    try {
        // Dekoduj JWT token z Google
        const responsePayload = parseJwt(response.credential);
        
        // Pokaż dane użytkownika w konsoli
        console.log("✅ Zalogowano pomyślnie!");
        console.log("ID: " + responsePayload.sub);
        console.log("Name: " + responsePayload.name);
        console.log("Email: " + responsePayload.email);
        console.log("Picture: " + responsePayload.picture);
        
        // Wyświetl dane użytkownika na stronie
        displayUserInfo(responsePayload);
        
        // Wyślij token do backendu (kolega musi stworzyć ten endpoint)
        fetch('/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: response.credential,
                user: {
                    id: responsePayload.sub,
                    name: responsePayload.name,
                    email: responsePayload.email,
                    picture: responsePayload.picture
                }
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log('✅ Odpowiedź z backendu:', data);
            showSuccess('Pomyślnie zalogowano!');
        })
        .catch(err => {
            console.error('❌ Błąd komunikacji z backendem:', err);
            showError('Błąd połączenia z serwerem. Sprawdź czy backend działa.');
        });
        
    } catch (error) {
        console.error('❌ Błąd podczas logowania:', error);
        showError('Wystąpił błąd podczas logowania.');
    }
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function displayUserInfo(user) {
    // Ukryj przycisk logowania
    document.querySelector('.g_id_signin').style.display = 'none';
    document.getElementById('g_id_onload').style.display = 'none';
    
    // Pokaż informacje o użytkowniku
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userPicture').src = user.picture;
    document.getElementById('userInfo').style.display = 'block';
    
    // Zapisz dane w sessionStorage (opcjonalnie)
    sessionStorage.setItem('user', JSON.stringify(user));
}

function logout() {
    // Wyczyść dane sesji
    sessionStorage.removeItem('user');
    
    // Ukryj info użytkownika
    document.getElementById('userInfo').style.display = 'none';
    
    // Pokaż przycisk logowania
    document.querySelector('.g_id_signin').style.display = 'block';
    document.getElementById('g_id_onload').style.display = 'block';
    
    // Opcjonalnie: wyślij request do backendu o wylogowanie
    fetch('/api/auth/logout', { method: 'POST' })
        .catch(err => console.log('Błąd wylogowania:', err));
    
    console.log('✅ Wylogowano');
}

function showError(message) {
    const errorEl = document.getElementById('errorMsg');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => errorEl.style.display = 'none', 5000);
}

function showSuccess(message) {
    const successEl = document.getElementById('successMsg');
    successEl.textContent = message;
    successEl.style.display = 'block';
    setTimeout(() => successEl.style.display = 'none', 3000);
}

// Sprawdź czy użytkownik był już zalogowany (opcjonalnie)
window.onload = function() {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
        displayUserInfo(JSON.parse(savedUser));
    }
};