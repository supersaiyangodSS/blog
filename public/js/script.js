document.addEventListener('DOMContentLoaded', () => {
    const allBtns = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar')
    const searchInput = document.getElementById('searchInput')
    const searchClose = document.getElementById('searchClose')

    allBtns.forEach((btn) => {
        btn.addEventListener('click', function () {
            searchBar.style.visibility = 'visible'
            searchBar.classList.add('open')
            this.setAttribute('aria-expanded', 'true')
            searchInput.focus()
        })

        searchClose.addEventListener('click', function () {
            searchBar.style.visibility = 'hidden'
            searchBar.classList.remove('open')
            this.setAttribute('aria-expanded', 'false')
        })

    })
})