const { VITE_API_URL } = import.meta.env
function FetchActions(url: string) {
    const fetchHandle = async (method: string, param?: string | number, body?: unknown) => {
        console.log("fetch")
        try {
            const res = await fetch(`${VITE_API_URL}${url}${param ? '/' + param.toString() : ''}`, {
                method, body: body ? JSON.stringify(body) : null,
                // 跨源需設定自動攜帶cookie
                credentials: "include",

            });
            const data = await res.json();
            return data
        } catch (err) {
            console.log('errorMessage', err)
        }
    }
    const getFetchAction = (method: string) => async () => fetchHandle(method);
    const postFetchAction = (method: string) => async (body: unknown) => fetchHandle(method, undefined, body);
    const withParamFetchAction = (method: string) => async (param: string | number) => fetchHandle(method, param);
    const withParamBodyFetchAction = (method: string) => async (param: string | number | undefined, body: unknown) => fetchHandle(method, param, body);

    const get = getFetchAction("GET")

    const post = postFetchAction("POST")

    const getById = withParamFetchAction("GET")
    const _delete = withParamFetchAction("DELETE")
    const deleteAll = postFetchAction("DELETE")
    const deleteAllnoParam = getFetchAction("DELETE")

    const put = withParamBodyFetchAction("PUT")
    const patch = withParamBodyFetchAction("PATCH")


    return ({
        get,
        post,
        delete: _delete,
        put,
        patch,
        getById,
        deleteAll,
        deleteAllnoParam
    })
}

export default FetchActions