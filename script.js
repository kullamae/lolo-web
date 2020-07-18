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
    site.el.main.addEventListener('click', site.fn.getArticleData)
    site.el.popup.close.addEventListener('click', site.fn.closeArticle)
  },
  getArticleData(event) {
    const article = event.target.closest('article')
    const link = article ? article.getAttribute('data-link') : null
    site.el.body.classList.add(site.classes.popup.opened)
    if (article && link) {
      fetch('./article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({link}),
      })
        .then((response) => {
          return response.json().then((content) => {
            site.fn.openArticle(content)
            site.el.body.classList.add(site.classes.popup.loaded)
          })
        })
        .catch((error) => {
          console.log('Request failed', error)
        })
    }
  },
  openArticle(data) {
    site.el.popup.title.innerHTML = data.title
    site.el.popup.content.innerHTML = data.content
  },
  closeArticle() {
    site.el.body.classList.remove(site.classes.popup.opened, site.classes.popup.loaded)
    window.setTimeout(() => {
      site.el.popup.container.scrollTop = 0
    }, 1000)
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
    return response.json().then((content) => {
      site.el.main.innerHTML = site.fn.getHtmlFromData(content)
      site.el.body.classList.add('loaded')
      site.fn.init()
    })
  })