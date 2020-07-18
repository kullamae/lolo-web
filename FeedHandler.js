const request = require('request');

function regexpGetTagContent(tag, string) {
  const regexp = new RegExp(`(?<=(<${tag}>))(.+?)(?=(</${tag}>))`, 'gs')
  const match = string.match(regexp)
  return (match && match.length === 1) ? match[0] : match
}

function regexpGetUrlFromString(string) {
  const regexp = new RegExp(`(?<=(url="))(.+?)(?=("))`, 's')
  const match = string.match(regexp)
  return (match && match.length) ? match[0] : match
}

function generateFeedObject(xmlBody) {
  const feedObject = []
  const items = regexpGetTagContent('item', xmlBody)

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const article = {
      title: regexpGetTagContent('title', item),
      link: regexpGetTagContent('link', item),
      description: regexpGetTagContent('description', item),
      media: regexpGetUrlFromString(item),
    }

    if (article.title && article.link ) feedObject.push(article)
  }

  return new Promise((resolve, reject) => {
    resolve(feedObject)
  });
}

function getFeedData() {
  const feed = 'https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss';
  return new Promise((resolve, reject) => {
    request({
      uri: feed,
      encoding: 'UTF-8'
    },
    (error, response, body) => {
      generateFeedObject(body)
      .then(articles => {
        if (articles.length) {
          resolve(articles)
        } else {
          reject('No articles retrieved')
        }
      })
    })
  })
}

module.exports = {
  getFeedData
}

