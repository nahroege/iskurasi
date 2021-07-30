function $(selector) {
  if (selector[0] == '#') {
    return document.getElementById(selector.slice(1))
  }
  return document.querySelectorAll(selector)
}

var App = {

  update(values) {
    this.state = Object.assign({}, this.state, values)
    this.render()
  },

  get(key) {
    return this.state[key]
  },

  state: {
    names: new Set(),
    selecteds: []
  },

  onAddNames(event) {
    event.preventDefault()
    var data = new FormData(this.$addNamesForm)

    var names = data.get('names')
      .split(',')
      .map(name => name.replace(/(\[|\]|\"|\n)/g, '').trim())

    var newNames = this.get('names')
    names.forEach(name => {
      newNames.add(name)
    })

    this.update({
      names: newNames
    })

    this.$addNamesForm
      .querySelector('textarea')
      .value = ''
  },

  onClickStart() {
    var names = this.get('names')
    var selecteds = this.get('selecteds')
    var selected = Math.floor(Math.random() * names.size)

    if (selecteds.includes(selected)) {
      return this.onClickStart()
    }

    this.update({
      selecteds: selecteds.concat(selected)
    })
  },

  init() {
    this.$addNamesForm = $('#add-names')
    this.$addNamesForm.addEventListener('submit', this.onAddNames.bind(this))

    this.$namesList = $('#names-list')
    this.$selectedNamesList = $('#selected-names-list')

    this.$startButton = $('#start-button')
    this.$startButton.addEventListener('click', this.onClickStart.bind(this))

    this.render()
  },

  render() {
    var names = this.get('names')
    var selecteds = this.get('selecteds')

    this.$startButton.disabled = names.size == selecteds.length

    var listHTML = ''
    var list = []
    names.forEach(name => {
      listHTML += `<li>${name}</li>`
      list.push(name)
    })
    this.$namesList.innerHTML = listHTML

    var selectedListHTML = selecteds.map(selected => {
      return `<li>${list[selected]}</li>`
    }).join(' ')
    this.$selectedNamesList.innerHTML = selectedListHTML

    console.log('names', this.get('names').size)
    console.log('selected-names', this.get('selecteds'))
  }
}

App.init()
