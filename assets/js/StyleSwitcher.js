export default class StyleSwitcher {
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

    //Switcher
    const switcher = document.getElementById('themeSwitcher');
    switcher.innerHTML = data.switcher[this.currentStyle];
    
    //Picture
    const pictureNode = document.getElementsByClassName('portrait')[0];
    pictureNode.src = data.header.picture[this.currentStyle];

    // Info
    const infoNode = document.getElementsByClassName('info')[0].querySelectorAll('p strong');
    infoNode[0].innerHTML = data.header.place[this.currentStyle] + ' : ';
    infoNode[1].innerHTML = data.header.birthday[this.currentStyle] + ' : ';

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

    // Footer
    const foot = document.querySelector('footer p em');
    foot.innerHTML = data['footer'];
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