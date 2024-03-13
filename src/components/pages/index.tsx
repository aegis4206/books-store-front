import { useState } from 'react'

const Index = () => {
  const [count, setCount] = useState<number>(0)

  const api = async () => {


    const res = await fetch("http://127.0.0.1:8001/login", {
      method: "POST",
      body: JSON.stringify({
        email: "white@white.white",
        password: "123456"
      })
    })
    console.log("res", res)
    const data = await res.text()
    console.log("data", data)
  }

  return (
    <div>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <button onClick={api}>
        api
      </button>
    </div>
  )
}

export default Index