import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AdminRoom } from "../pages/AdminRoom";
import { Home } from "../pages/Home";
import { NewRoom } from "../pages/NewRoom";
import { Room } from "../pages/Room";

export function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/new-room" exact component={NewRoom} />
                <Route path="/room/:id" exact component={Room} />
                <Route path="/admin/room/:id" exact component={AdminRoom} />
            </Switch>
        </BrowserRouter>
    )
}