import { Header } from './components/Header'
import './App.css'
import { PostList } from './components/PostList'
import { useGetPostsQuery } from './api/baseApi'

function App() {
  const { data: posts = [], isLoading, isError } = useGetPostsQuery()

  return (
    <main>
      <Header title='Forum Posts' description='first react project' />
      {isLoading && <p>Завантаження постів...</p>}
      {isError && <p>Не вдалося завантажити пости</p>}
      {!isLoading && !isError && (
        posts.length > 0
          ? <PostList posts={posts} />
          : <p>Постів не знайдено</p>
      )}
    </main>
  )
}

export default App
