<script>
    import "../../app.css";
    import Header from "$lib/components/header.svelte";
    import {Collection, Icon, Search} from 'svelte-hero-icons';
</script>

<!DOCTYPE html />
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Celestia</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossorigin="true"
        />
        <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
            rel="stylesheet"
        />
    </head>
    <body class="p-4 bg-gray-100 open-sans">
        <div class="w-full p-4">
            <Header>
                <div class="flex flex-row gap-4 items-center">
                    <a href="/dashboard/tabs" alt="Tabs">
                        <Icon src={Collection} class="h-6 w-6 hover:text-blue-500 duration-300"></Icon>
                    </a>
                </div>
            </Header>
            <slot></slot>
        </div>
    </body>
</html>
