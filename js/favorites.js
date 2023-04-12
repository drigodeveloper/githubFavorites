import { GithubUser } from "./githubUser.js"


export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
        GithubUser.search('drigodeveloper').then(user => console.log(user))
    }

    load() {

        this.entries = JSON.parse(localStorage.getItem
        ('@github-favorites:')) || []

        // this.entries = [
        //     {
        //     login: 'RorigoCampos2016',
        //     name: 'Rodrigo Campos',
        //     publicsRepos: '76',
        //     followers: '120000'
        // },
        // {
        //     login: 'thaidevfront',
        //     name: 'Thiana Oliveira',
        //     publicsRepos: '23',
        //     followers: '12'
        // }] 
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }
    async add(username) {
        try {

            const userExist = this.entries.find(entry => entry.login === username)

            if(userExist) {
                throw new Error('Usuário já cadastrado!')
            }

            const user = await GithubUser.search(username)
            if(user.login === undefined) {
                throw new Error("Usuário não encontrado!")
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        }catch(error) {
            alert(error.message)
        }
        
    }
        
        delete(user) {
            const fillterEntries = this.entries.filter(entry => entry.login !== user.login)
            this.entries = fillterEntries
            this.update()
            this.save()
        }
    }
    


export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector("table tbody")
        this.update()
        this.onadd()
    }

    onadd() {
        const srcButton = document.querySelector('.search button')
        srcButton.onclick = () => {
    
            const {value} = this.root.querySelector('.search input')
            this.add(value)
        }
    }
    update() {
        this.removeAllTr()
        
        this.entries.forEach(user => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = `/${user.login}`
            row.querySelector('.Repositories').textContent = user.public_repos
            row.querySelector('.Followers').textContent = user.followers
            
            row.querySelector('.close').onclick =  () => {
                const isOk = confirm("Tem certeza que deseja remover essa linha?")
                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })

    }
    
    createRow() {
        const tr = document.createElement('tr')            
        tr.innerHTML = `
                    <td class="user">
                        <img src="https://github.com/drigodeveloper.png" alt="">
                        <a href="https://github.com/drigodeveloper" target="_blank">
                            <p>Rodrigo Campos</p>
                            <span>/drigodeveloper</span>
                        </a>
                    </td>
                    <td class="Repositories">
                        123
                    </td>
                    <td class="Followers">
                        1234
                    </td>
                    <td>
                        <button class="close">
                         Remover
                        </button>
                    </td>
        `
        
        return tr
   
    }
    
    removeAllTr() {
        
        this.tbody.querySelectorAll('tr').forEach((tr) => {
          tr.remove()  
        });
    }
}

