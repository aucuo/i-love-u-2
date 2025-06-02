import fs from 'fs'
import path from 'path'

/**
 * Рекурсивно находит все .html файлы в указанной директории
 * @param {string} dir - Начальная директория поиска
 * @returns {string[]} Список путей к HTML-файлам
 */
export function getHtmlFiles(dir) {
  let results = []

  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath))
    } else if (file.endsWith('.html')) {
      results.push(filePath)
    }
  })

  return results
}