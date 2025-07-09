class StyleSwitcher {
  constructor(lang, style, data) {
    this.currentLang = lang;
    this.currentStyle = style;
    this.data = data;
    this.init();
  }
  init() {
    this.switchLanguage(this.currentLang);
    this.switchStyle(this.currentStyle);
  }
  switchLanguage(lang) {
    this.currentLang = lang;
    this.switchData();
    document.querySelector('html').lang = lang.toLowerCase();
    console.log(`Language switched to: ${this.currentLang}`);
  }
  switchStyle(style) {
    this.currentStyle = style;
    this.switchData();
    document.querySelector('body').className = style.toLowerCase();
    console.log(`Style switched to: ${this.currentStyle}`);
  }
  switchData() {
    const data = this.data[this.currentLang];

    //Picture
    const pictureNode = document.getElementsByClassName('portrait')[0];
    pictureNode.src = data.header.picture[this.currentStyle];

    // Info
    const placeNode = document.getElementsByClassName('info')[0].querySelectorAll('p strong')[0];
    placeNode.innerHTML = data.header.place[this.currentStyle] + ' : ';

    // Jobs
    const jobsList = this.prepareSection('jobs', data.jobs);

    data.jobs.content.forEach(job => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${job.year}</strong> - ${job.name} : ${job.role}<br><em>${job.details}</em>`;
      jobsList.appendChild(li);
    });

    // Education
    const educList = this.prepareSection('education', data.education);

    data.education.content.forEach(educ => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${educ.year}</strong> - ${educ.school}<br><em>${educ.studies}</em>`;
      educList.appendChild(li);
    });

    // Achievements
    const achievementsList = this.prepareSection('achievements', data.achievements);

    data.achievements.content.forEach(achievement => {
      let detailledList = '';

      if (achievement.list && achievement.list.length > 0) {
        detailledList = '<ul>';
        achievement.list.forEach(item => {
          let title = item.link ? `<a href="${item.link}" target="_blank">${item.name}</a>` : item.name;
          detailledList += `<li>${title} : ${item.description} -- ${item.tech}</li>`;
        });
        detailledList += '</ul>';
      }

      const li = document.createElement('li');
      li.innerHTML = `<strong>${achievement.year}</strong> - ${achievement.name[this.currentStyle]} (${achievement.subtitle}) <span class="viewmore">i</span>`;
      li.innerHTML += `<div class="closed">${achievement.details}${detailledList}</div>`;

      achievementsList.appendChild(li);
    });

    // Skills
    const skillList = this.prepareSection('skills', data.skills);

    data.skills.content[this.currentStyle].forEach(skill => {
      let detailledList = '';

      if (skill.list && skill.list.length > 0) {
        detailledList = '<ul>';
        skill.list.forEach(item => detailledList += `<li>${item}</li>`);
        detailledList += '</ul>';
      }

      const li = document.createElement('li');
      li.innerHTML = `<strong>${skill.name}</strong>${detailledList}`;
      skillList.appendChild(li);
    });

    // Assets
    const assetsList = this.prepareSection('assets', data.assets);

    data.assets.content[this.currentStyle].forEach(asset => {
      const li = document.createElement('li');
      li.innerHTML = asset;
      assetsList.appendChild(li);
    });
  }
  prepareSection(nodeId, data) {
    const node = document.getElementById(nodeId);
    const nodeList = node.querySelector('ul');

    //node.querySelector('h2').innerHTML = `ICON - ${data.title[this.currentStyle]}`;
    node.querySelector('h2').innerHTML = `<img class="title-icon" src="${data.icon[this.currentStyle]}"> ${data.title[this.currentStyle]}`;
    nodeList.innerHTML = '';

    return nodeList;
  }
};

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
  const response = await fetch('./data.json');
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
  switcherDiv.querySelectorAll('[name="langswitcher"]').forEach(radio =>{
    radio.addEventListener('change', e => {
      console.log(e.target.checked)
      if(e.target.checked) {
        document.querySelectorAll('.viewmore').forEach(elem => elem.removeEventListener('click', showDetails));
        styleSwitcher.switchLanguage(e.target.value.toLowerCase())
        document.querySelectorAll('.viewmore').forEach(elem => elem.addEventListener('click', showDetails));
      }
    });
  });
  
  /*
  switcherDiv.querySelectorAll('.langswitcher').forEach(button => {
    button.addEventListener('click', e => {
      document.querySelectorAll('.viewmore').forEach(elem => elem.removeEventListener('click', showDetails));
      styleSwitcher.switchLanguage(e.target.value.toLowerCase())
      document.querySelectorAll('.viewmore').forEach(elem => elem.addEventListener('click', showDetails));
    });
  });
*/
  /** Theme events */
  switcherDiv.querySelector('a').addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.viewmore').forEach(elem => elem.removeEventListener('click', showDetails));
    
    if(e.target.textContent.search('classique') === -1 && e.target.textContent.search('classic') === -1) {
      e.target.innerHTML = 'Vous cherchez quelque chose de plus <em>classique</em> ?';
      styleSwitcher.switchStyle('fantasy');
    }
    else {
      e.target.innerHTML = 'Vous cherchez quelque chose de plus <em>épique</em> ?';
      styleSwitcher.switchStyle('classic');
    }

    document.querySelectorAll('.viewmore').forEach(elem => elem.addEventListener('click', showDetails));
  });

  /** OLD version using the select element
  document.getElementById('styleCombo').addEventListener('change', e => {
    document.querySelectorAll('.viewmore').forEach(elem => elem.removeEventListener('click', showDetails));
    styleSwitcher.switchStyle(e.target.value.toLowerCase());
    document.querySelectorAll('.viewmore').forEach(elem => elem.addEventListener('click', showDetails));
  });
  */
};

main();