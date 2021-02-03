import { useEffect } from "react";

export default function LoginRedirect(props) {
    useEffect(() => window.parent.parent.location = '/login')
    return (
        <></>
    )
}
