import StyleSwitcher from './StyleSwitcher.js';

const calculateAge = (birthDate) => {
  const now = new Date();
  const ageDiff = now - birthDate;
  const ageDate = new Date(ageDiff);
  console.log(ageDate, ageDiff, now, birthDate);
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
  const contact = document.getElementsByTagName('address')[0];
  if(contact.classList.contains('hide'))
    contact.classList.toggle('hide');
};

const removeContactOnPrint = () => {
  const contact = document.getElementsByTagName('address')[0];
  if(!contact.classList.contains('hide'))
    contact.classList.toggle('hide');
};

const main = async () => {
  const response = await fetch('assets/data/cv.json');
  const data = await response.json();
  const styleSwitcher = new StyleSwitcher('fr', 'classic', data);

  // Calculate age and set it in the HTML
  //document.getElementById('age').textContent = calculateAge(new Date(1983, 10, 8));

  document.querySelectorAll('.viewmore').forEach(elem => elem.addEventListener('click', showDetails));

  const switcherDiv = document.getElementById('switcher');
  const addressBlock = document.querySelector('address');

  /** Printing events */
  window.addEventListener('beforeprint', e => addContactOnPrint());
  window.addEventListener('afterprint', e => removeContactOnPrint());
  switcherDiv.querySelector('#print').addEventListener('click', e => window.print());

  /** Display contact */
  switcherDiv.querySelector('#contact').addEventListener('click', e => addressBlock.classList.toggle('hide'));
  document.getElementById('close').addEventListener('click', e => addressBlock.classList.toggle('hide'));

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
    let target = (e.target.tagName === 'EM') ? e.target : e.target.querySelector('em');

    const switchIt = () => {
       document.querySelectorAll('.viewmore').forEach(elem => elem.removeEventListener('click', showDetails));

      if (styleSwitcher.currentStyle === 'classic') {
        target.innerHTML = 'classique';
        styleSwitcher.switchStyle('fantasy');
      }
      else {
        target.innerHTML = 'épique';
        styleSwitcher.switchStyle('classic');
      }

      document.querySelectorAll('.viewmore').forEach(elem => elem.addEventListener('click', showDetails));
    };

    if (document.startViewTransition) {
      document.startViewTransition(() => switchIt());
    }
    else {
      const portrait = document.querySelector('.portrait');
      const info = document.querySelector('.info');
      portrait.style.opacity = 0;
      info.style.opacity = 0;
      setTimeout(() => {
        switchIt();
        portrait.style.opacity = 1;
        info.style.opacity = 1;
      }, 500);
    }    
  });
};

main();