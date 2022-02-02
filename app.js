$(() => {
    const formulario = $("#formulario");
    const inputText = $("#inputText");
    const resultado = $("#resultado");
    const error = $("#error");

    let localStorageArray = [];

    const pintarEnlaces = () => {
        // console.log(data);
        resultado.html("");
        localStorageArray.forEach((item) => {
            resultado.append(`
            <div class="card mb-2">
                <div class="card-body">
                    <p class="mb-0">
                        ${item.original_link}
                    </p>
                    <a href="${item.full_short_link}">
                        ${item.full_short_link}
                    </a>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-primary" data-url="${item.full_short_link}">Copiar</button>
                        <button class="btn btn-sm btn-outline-primary" data-nameurl="${item.full_short_link}">Eliminar</button>
                    </div>
                    </div>
            </div>
            `);
        });
    };

    if (localStorage.getItem("enlaces")) {
        localStorageArray = JSON.parse(localStorage.getItem("enlaces"));
        console.log(localStorageArray);
        pintarEnlaces();
    }

    formulario.on("submit", (e) => {
        e.preventDefault();
        console.log(inputText.val());

        const busqueda = localStorageArray.findIndex(
            (item) => item.original_link === inputText.val()
        );

        if (busqueda !== -1) {
            error.removeClass("d-none");
            return;
        } else {
            error.addClass("d-none");
        }

        $.ajax({
            url: `https://api.shrtco.de/v2/shorten?url=${inputText.val()}`,
            type: "GET",
            dataType: "JSON",
            beforeSend() {
                console.log("cargando... inicio");
            },
            success(data) {
                if (data.ok) {
                    localStorageArray.push(data.result);
                    localStorage.setItem(
                        "enlaces",
                        JSON.stringify(localStorageArray)
                    );
                    pintarEnlaces();
                }
            },
            error(err) {
                console.log(err);
            },
            complete() {
                console.log("fin cargando...");
                // reset inputs formulario
                formulario.trigger("reset");
            },
        });
    });

    document.addEventListener("click", (e) => {
        if (e.target.dataset.url) {
            console.log(e.target.dataset.url);
            navigator.clipboard
                .writeText(e.target.dataset.url)
                .then(() => {
                    console.log("Text copied to clipboard...");
                })
                .catch((err) => {
                    console.log("Something went wrong", err);
                });
        }

        if (e.target.dataset.nameurl) {
            localStorageArray = localStorageArray.filter(
                (item) => item.full_short_link !== e.target.dataset.nameurl
            );
            localStorage.setItem("enlaces", JSON.stringify(localStorageArray));
            pintarEnlaces();
        }
    });
});
