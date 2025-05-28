
export async function fetcher<T>(
    url: string,
    token?: string,
    options?: RequestInit,
): Promise<T> {
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? {Authorization: `Bearer ${token}`} : {})
        },
        ...options
    })
    if(!res.ok) {
        const resData = await res.json();
        throw new Error(await resData.detail);
    }

    return res.json();
}

export async function postFethcer<T>(
    url: string,
    body: unknown,
    token?: string,
): Promise<T> {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if(!res.ok) {
        const resData = await res.json();
        throw new Error(await resData.detail || "POST request failed");
    }
    return res.json();
}

export async function deleteFetcher<T = void>(
    url: string,
    token?: string
): Promise<T> {
    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    })

    if(!res.ok) {
        const resData = await res.json();
        throw new Error(await resData.detail || "DELETE request failed");
    }

    return res.status !== 204 ? res.json() : ({} as T);
}

export async function updateFetcher<T> (
    url: string,
    body: unknown,
    token?: string
): Promise<T> {
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    if(!res.ok) {
        const resData = await res.json();
        throw new Error(await resData.detail || "PUT request failed");
    }

    return res.json();
}
