import { Header } from './components/Header'
import './App.css'
import { PostList } from './components/PostList'
import { posts } from './data/posts'

function App() {
  return(
    <main>
      <Header title='Forum Posts' description='first react project'/>
      <PostList posts={posts} />
    </main>
  )
}

export default App
