var flatsheet = require('flatsheet-api-client')({
  host: 'http://seward.flatsheet.io'
})

var main = document.getElementById('main')



  /* 
  * categories
  */

  var checkedCategories = []
  var menu = document.getElementById('filter')
  categories = getAllCategories(data)

  categories.forEach(function addCheckbox(item) {
    var div = document.createElement('div')
    elClass(div).add('filter-option')
    
    var checkbox = document.createElement('input')
    checkbox.className = 'categoryCheckbox'
    checkbox.type = 'checkbox'
    checkbox.name = item
    checkbox.value = item
    checkbox.checked = true
    checkbox.addEventListener('change', updateWithFilters)
    
    var label = document.createElement('label')
    label.appendChild(document.createTextNode(item))
    label.htmlFor = item
    
    div.appendChild(checkbox)
    div.appendChild(label)
    menu.appendChild(div)
  })


  /* 
  * add a marker to map from json data 
  */

  var markerGroup = new L.FeatureGroup()
  data.forEach(addMarker)

  updateWithFilters()

  function moveActiveMarker(latLng){
    if(activeMarker === undefined){
      activeMarker = L.marker(L.latLng(latLng), {
        icon: L.mapbox.marker.icon({
          'marker-size': 'small',
          'marker-line-color': '#335966',
          'marker-line-opacity': 1,
          'marker-color': '#f00',
          'zIndexOffset': 99,
        })
      })
      markerGroup.addLayer(activeMarker)
    } else {
      activeMarker.setLatLng(latLng)
    }
    activeMarker.update()
  }

  function addMarker (row, i) {
    var latlng = { lat: row['lat'], lng: row['long'] }
    
    var marker = L.marker(latlng, {
      icon: L.mapbox.marker.icon({
        'marker-size': 'small',
        'marker-line-color': '#335966',
        'marker-line-opacity': 1,
        'marker-color': '#335966',
      })
    })

    markerGroup.addLayer(marker)
    
    marker.on('click', function(e) {
      window.location.hash = '/' + row.id
      moveActiveMarker(this.getLatLng())
    })
  }


  function modal (content) {
    if (document.querySelector('.modal')) {
      main.removeChild(document.querySelector('.modal'))
    }

    var modal = document.createElement('div')
    modal.className = 'modal'
    modal.innerHTML = content
    main.appendChild(modal)
    resizeModal()
  }

  on(document.body, '#close-modal', 'click', function (e) {
    var modal = document.querySelector('.modal')
    main.removeChild(modal)
    markerGroup.removeLayer(activeMarker)
    activeMarker = undefined
    e.preventDefault()
  })

  function resizeModal () {
    var content = document.querySelector('.modal-inner')
    content.style.width = (window.innerWidth - 44) + 'px'

    if (window.innerWidth < 470) {
      content.style.height = window.innerHeight - 152 + 'px'
    }
    else {
      content.style.height = window.innerHeight - 107 + 'px'
    }

    if (window.innerWidth > 800) {
      content.style.width = window.innerWidth / 2 + 'px'
      content.style.maxWidth = '500px'
    }
  }



  function updateWithFilters() {
    checkedCategories = []
    var categoryCheckboxes = document.getElementsByClassName('categoryCheckbox')
    
    for (var i = 0 i < categoryCheckboxes.length i++) {
      if (categoryCheckboxes[i].checked) {
        checkedCategories.push(categoryCheckboxes[i].value)
      }
    }

    markerGroup.clearLayers()
    map.removeLayer(markerGroup)
    
    if (checkedCategories.length > 0) {
      data.filter(filterByCategory).forEach(addMarker)
    }

    map.addLayer(markerGroup)
  }

  function filterByCategory(element) {
    for (var i = 0 i < checkedCategories.length i++) {
      if (checkedCategories[i] === element.category) {
        return true
      }
    }
    return false
  }

  function getAllCategories(data) {
    var categories = []
    for (var i = 0 i < data.length i++) {
      if (!(categories.indexOf(data[i].category) >= 0)) {
        categories.push(data[i].category)
      }
    }
    return categories
  }

})

