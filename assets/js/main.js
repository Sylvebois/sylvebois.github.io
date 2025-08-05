import StyleSwitcher from './StyleSwitcher.js';

const calculateAge = (birthDate) => {
  const now = new Date();
  const ageDiff = now - birthDate;
  const ageDate = new Date(ageDiff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const showDetails = e => {
  const parent = e.target.closest('li');
  const childDiv = parent.querySelector('div');
  if (childDiv && childDiv.className === 'closed') {
    document.querySelectorAll('.open').forEach(openDiv => openDiv.className = 'closed');
    childDiv.className = 'open';
  }
  else if (childDiv && childDiv.className === 'open') {
    childDiv.className = 'closed';
  }
};

const addContactOnPrint = () => {
  const info = document.getElementsByClassName('info')[0];
  const contact = document.createElement('address');
  contact.innerHTML = '<p>\u{1F4F1} <a href="tel:+32476980231">0476 98 02 31</a></p>';
  contact.innerHTML += '<p>\u{1F4E7} <a href="mailto:thomasghaye@hotmail.com">thomasghaye@hotmail.com</a></p>';
  contact.innerHTML += '<p>\u{1F30E} <a href="https://sylvebois.github.io">sylvebois.github.io</a</p>'
  info.appendChild(contact);
};

const removeContactOnPrint = () => {
  const contact = document.getElementsByTagName('address')[0];
  contact.remove();
};

const main = async () => {
  const response = await fetch('assets/data/data.json');
  const data = await response.json();
  const styleSwitcher = new StyleSwitcher('fr', 'classic', data);

  // Calculate age and set it in the HTML
  document.getElementById('age').textContent = calculateAge(new Date(1983, 10, 8));

  document.querySelectorAll('.viewmore').forEach(elem => elem.addEventListener('click', showDetails));

  const switcherDiv = document.getElementById('switcher');

  /** Printing events */
  window.addEventListener('beforeprint', e => addContactOnPrint());
  window.addEventListener('afterprint', e => removeContactOnPrint());
  switcherDiv.querySelector('#print').addEventListener('click', e => window.print());

  /** Language events */
  console.log(switcherDiv.querySelectorAll('[name="langswitcher"]'))
  switcherDiv.querySelectorAll('[name="langswitcher"]').forEach(radio => {
    radio.addEventListener('change', e => {
      if (e.target.checked) {
        document.querySelectorAll('.viewmore').forEach(elem => elem.removeEventListener('click', showDetails));
        styleSwitcher.switchLanguage(e.target.value.toLowerCase())
        document.querySelectorAll('.viewmore').forEach(elem => elem.addEventListener('click', showDetails));
      }
    });
  });

  /** Theme events */
  switcherDiv.querySelector('#themeSwitcher').addEventListener('click', e => {
    e.preventDefault();
    let target = (e.target.tagName === 'EM')? e.target : e.target.querySelector('em');

    document.querySelectorAll('.viewmore').forEach(elem => elem.removeEventListener('click', showDetails));

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        if (styleSwitcher.currentStyle === 'classic') {
          target.innerHTML = 'classique';
          styleSwitcher.switchStyle('fantasy');
        }
        else {
          target.innerHTML = 'épique';
          styleSwitcher.switchStyle('classic');
        }
      });
    }
    else {
      if (styleSwitcher.currentStyle === 'classic') {
        target.innerHTML = 'classique';
        styleSwitcher.switchStyle('fantasy');
      }
      else {
        target.innerHTML = 'épique';
        styleSwitcher.switchStyle('classic');
      }
    }

    document.querySelectorAll('.viewmore').forEach(elem => elem.addEventListener('click', showDetails));
  });
};

main();