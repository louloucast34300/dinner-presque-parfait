import { Outlet } from "@remix-run/react";


export default function SessionRoute () {
    return (
        <div>
            <h1>Session</h1>
            <Outlet/>
        </div>
    )
}