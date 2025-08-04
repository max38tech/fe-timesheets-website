document.addEventListener('DOMContentLoaded', function() {
    const contentForm = document.getElementById('content-form');

    // A reference to the document that stores the website settings
    const settingsRef = db.collection('settings').doc('main-page');

    // Function to load the current settings into the form
    const loadSettings = () => {
        settingsRef.get().then(doc => {
            if (doc.exists) {
                const settings = doc.data();
                document.querySelectorAll('[data-editable]').forEach(el => {
                    const key = el.getAttribute('data-editable');
                    const input = document.getElementById(key);
                    if (input && settings[key]) {
                        input.value = settings[key];
                    }
                });
                document.getElementById('contact-email').value = settings.contactEmail || '';
                document.getElementById('contact-phone').value = settings.contactPhone || '';
                document.getElementById('contact-location').value = settings.contactLocation || '';
            } else {
                console.log("No settings document found. You can create one by saving the form.");
            }
        }).catch(error => {
            console.error("Error getting settings:", error);
        });
    };

    // Function to save the settings
    const saveSettings = (e) => {
        e.preventDefault();
        const newSettings = {};
        document.querySelectorAll('[data-editable]').forEach(el => {
            const key = el.getAttribute('data-editable');
            const input = document.getElementById(key);
            if (input) {
                newSettings[key] = input.value;
            }
        });
        newSettings.contactEmail = document.getElementById('contact-email').value;
        newSettings.contactPhone = document.getElementById('contact-phone').value;
        newSettings.contactLocation = document.getElementById('contact-location').value;

        settingsRef.set(newSettings, { merge: true }) // Use merge:true to avoid overwriting other fields if they exist
            .then(() => {
                alert('Content updated successfully!');
            })
            .catch(error => {
                console.error('Error updating content: ', error);
                alert('There was an error saving the content.');
            });
    };

    // Add event listener to the form
    if (contentForm) {
        contentForm.addEventListener('submit', saveSettings);
    }

    // Load the settings when the page is ready and the user is authenticated
    auth.onAuthStateChanged(user => {
        if (user) {
            loadSettings();
        }
    });
});