'use strict'

const site = {
  el: {
    body: document.querySelector('body'),
    main: document.querySelector('main'),
    popup: {
      el: document.querySelector('.popup'),
      title: document.querySelector('.popup__title'),
      container: document.querySelector('.popup__container'),
      content: document.querySelector('.popup__text'),
      close: document.querySelector('.popup__close'),
    },
  },
  classes: {
    body: {
      loaded: 'loaded'
    },
    popup: {
      opened: 'popup--open',
      loaded: 'popup--loaded'
    }
  }
}

site.fn = {
  init() {
  },
  getHtmlFromData(articlesJson) {
    let html = ''
    for (let i = 0; i < articlesJson.length; i++) {
      const article = articlesJson[i];
      html += `<article class="article" data-link="${article.link}">`;
        html += `<figure class="article__media">`;
        if (article.media) {
          html += `<img loading="lazy" src="${article.media}" alt="Image"/>`;
        }
        html += `</figure>`;
        html += `<summary class="article__content">
          <header class="article__header">
            <h3 class="article__title">${article.title}</h3>
          </header>`;
        if (article.description) {
          html += `<p>${article.description}</p>`;
        }
        html += `</summary>
      </article>`;
    }
    return html
  }
}

fetch('./feed', {
    headers: {
      'Content-Type': 'application/json',
    }
  }
)
  .then((response) => {
    return response.json().then(function(content) {
      site.el.main.innerHTML = site.fn.getHtmlFromData(content)
      site.el.body.classList.add('loaded')
      site.fn.init()
    })
  })