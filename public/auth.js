auth.onAuthStateChanged(user => {
    const loginContainer = document.getElementById('login-container');
    const adminPanel = document.getElementById('admin-panel');
    const userEmail = document.getElementById('user-email');

    if (user) {
        if (loginContainer) loginContainer.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'block';
        if (userEmail) userEmail.textContent = user.email;
    } else {
        if (loginContainer) loginContainer.style.display = 'block';
        if (adminPanel) adminPanel.style.display = 'none';
    }
});
