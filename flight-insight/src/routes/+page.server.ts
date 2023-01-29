

import type { Actions,RequestEvent,Cookies } from "@sveltejs/kit"

/** @type {import('./$types').Actions} */
export const actions:Actions = {
    search: async ({cookies:Cookies, request:RequestEvent}) =>{

    },
    login: async (event:RequestEvent)=>{
        const data = await event.request.formData();
        const user = data.get("aadvantage");
        const password = data.get("password");

        return {success:true}

        console.log(data);
    }
}