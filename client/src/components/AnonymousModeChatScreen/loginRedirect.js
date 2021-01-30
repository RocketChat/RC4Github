import { Redirect } from "react-router-dom"

export default function LoginRedirect(props) {
    function handleLoginRedirect() {
      window.parent.parent.location = '/login';
    }
    if (props.authState.isLoggedIn) {
      return <Redirect to="/"></Redirect>;
    }
    return (
        <div className="login-redirect-screen">
            <div className="login-redirect-button" onClick={handleLoginRedirect}>
                Join now to collaborate more effectively!
            </div>
        </div>
    )
}
