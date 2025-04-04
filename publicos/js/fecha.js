window.onload = function () {
    const currentDate = new Date();
    const targetDate = new Date('June 7, 2025 16:30:00');

    const albumElement = document.querySelector('#album');
    const textosElement = document.querySelector('#textos');

    const hours = targetDate.getHours() % 12 || 12;
    const amPm = targetDate.getHours() >= 12 ? 'PM' : 'AM';
    const message = `Disponible el ${targetDate.toLocaleDateString()} a las ${hours}:${targetDate.getMinutes()} ${amPm}.`;

    const heartIcon = document.createElement('span');
    heartIcon.textContent = ' 💙';
    heartIcon.style.color = 'blue';
    heartIcon.style.fontSize = '1.5em';

    const messageElement = document.createElement('span');
    messageElement.textContent = message;
    messageElement.appendChild(heartIcon);

    const applyStylesAndMessageWithIcon = (element) => {
        if (!element) return;

        element.innerHTML = '';
        element.appendChild(messageElement);
        element.style.padding = '1em';
        element.style.textAlign = 'center';
        element.style.fontSize = '2.5em';
        element.style.fontWeight = 'bold';

        const homeIcon = document.createElement('a');
        homeIcon.href = '/';
        homeIcon.textContent = 'Volver';
        homeIcon.style.display = 'block';
        homeIcon.style.marginTop = '1em';
        homeIcon.style.fontSize = '1em';
        homeIcon.style.textDecoration = 'underline';
        homeIcon.style.color = 'blue';

        element.appendChild(homeIcon);
        element.style.display = 'block';
    };

    function applyStylesAndMessage(element, message) {
        if (!element) return;

        element.textContent = message;
        element.style.padding = '1em';
        element.style.textAlign = 'center';
        element.style.fontSize = '2.5em';
        element.style.fontWeight = 'bold';

        const homeIcon = document.createElement('a');
        homeIcon.href = '/';
        homeIcon.textContent = 'Volver';
        homeIcon.style.display = 'block';
        homeIcon.style.marginTop = '1em';
        homeIcon.style.fontSize = '1em';
        homeIcon.style.textDecoration = 'underline';
        homeIcon.style.color = 'blue';

        element.appendChild(homeIcon);
        element.style.display = 'block';
    }

    if (currentDate < targetDate) {
        applyStylesAndMessage(albumElement, message);
        applyStylesAndMessage(textosElement, message);
    } else {
        if (albumElement) {
            albumElement.style.display = 'block';
            albumElement.textContent = ''; // Limpia el contenido previo
        }

        if (textosElement) {
            textosElement.style.display = 'block';
        }
    }
};
