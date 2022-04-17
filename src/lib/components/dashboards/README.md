# Dashboards Components

Here lies the dashboard implementation for both the glassbox and document routes.

## Why not inside the routes?

The dashboard implementations are located here which is a bit sketchy but this is a workaround on SvelteKit's inability to allow the index of a route to greedily take all parameters after including without any parameters. 

To explain this a bit, say we head to `/dashboard/` and press one of the following glassboxes to which our code pushes a new history and changes our URL to `/dashboard/{glassbox}`. We then want to refresh, what do you expect would happen?
1. It would redirect to the same page as `/dashboard/`
2. It would fail to redirect since the route doesn't exist.

<summary>
    <details>Further Explanation</details>

    If the answer chosen was no.2 then correct. Sveltekit doesn't know that the route exists and therefore leads you to 
    a 404 error page. I don't know how to solve this without having to create duplicates of the same page, and so I decided 
    to make each dashboard into a component itself while making both routes.
</summary>