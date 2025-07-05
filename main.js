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
    pictureNode.src = data.picture[this.currentStyle];

    // Info
    const infoNode = document.getElementsByClassName('info')[0];

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
      li.innerHTML = `<strong>${achievement.year}</strong> - ${achievement.name[this.currentStyle]} (${achievement.subtitle}) -- <span class="viewmore">i</span>`;
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

    node.querySelector('h2').innerHTML = `ICON - ${data.title[this.currentStyle]}`;
    //node.querySelector('h2').innerHTML = `${data.icon[this.currentStyle]} - ${data.title[this.currentStyle]}`;
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

const main = async () => {
  const response = await fetch('./data.json');
  const data = await response.json();

  // Calculate age and set it in the HTML
  document.getElementById('age').textContent = calculateAge(new Date(1983, 10, 8));

  // Initialize the style switcher with the current language, style and data
  const currentLang = document.querySelector('html').lang || 'en';
  const currentStyle = document.getElementById('styleCombo').value.toLowerCase() || 'classic';
  const styleSwitcher = new StyleSwitcher(currentLang, currentStyle, data);

  document.querySelectorAll('.viewmore').forEach(elem => elem.addEventListener('click', showDetails));

  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', e => {
      document.querySelectorAll('.viewmore').forEach(elem => elem.removeEventListener('click', showDetails));
      styleSwitcher.switchLanguage(e.target.textContent.toLowerCase())
      document.querySelectorAll('.viewmore').forEach(elem => elem.addEventListener('click', showDetails));
    });
  });

  document.getElementById('styleCombo').addEventListener('change', e => {
    document.querySelectorAll('.viewmore').forEach(elem => elem.removeEventListener('click', showDetails));
    styleSwitcher.switchStyle(e.target.value.toLowerCase());
    document.querySelectorAll('.viewmore').forEach(elem => elem.addEventListener('click', showDetails));
  });
};

main();