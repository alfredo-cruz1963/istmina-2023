$(document).ready(function () {
  var municipio = $('.municipio').text();
  let opcion = null;
  let opcImagen = null;
  let opcModal = null;
  let dep, mun, zona, puesto, can, votos, sufragos, recuento, reclama, codigo;
  var datoSet;
  var mCodigo, mMesa, mFoto, mFoto2, mFotrec;
  let table, tr, rowData;
  let nuevaFilaIdx = null;
  let numPagina = null;

  //MOSTRAR
  let tablaEnvios = $("#tab-control").DataTable({
    processing: true,
    ajax: {
      url: "/envios/view",
      method: "GET",
      dataSrc: "",
    },
    rowId: "staffId",
    columns: [
      { data: "codigo" },
      { data: "mesa" },
      { data: "can1" },
      { data: "can2" },
      { data: "can3" },
      { data: "can4" },
      { data: "can5" },
      { data: "can6" },
      { data: "can7" },
      { data: "blancos" },
      { data: "nulos" },
      { data: "nomarcado" },
      { data: "sufragos" },
      { data: "recuento" },
      { data: "reclama" },
      { data: "foto" },
      { data: "foto2" },
      { data: "foto3" },
      { data: "fotrec" },
      {
        defaultContent: `<a href="#" class="btnEditar text-primary" title="Actualizar"><i class="fas fa-edit"></i></a>
                         <a href="#" class="btnBorrar text-danger" title="Eliminar"><i class="fas fa-trash-alt"></i></a>
                         <a href="#" class="btnEvidencias text-success" title="Evidencias"><i class="fas fa-image"></i></a>`,
      },
    ],
    createdRow: function (row, data, dataIndex) {
      //const reclamaValue = data.reclama; // Obtenemos el valor de la columna 'reclama' para esta fila
      //const fotoreclama = data.fotrec; // Obtenemos si se subio foto cuando hubo reclamacion para esta fila
      //const fotoValue = data.foto; // Obtenemos el valor de la columna 'foto' para esta fila
      //const fotoValue1 = data.foto2; // Obtenemos el valor de la columna 'foto1' para esta fila

      if (data.balance === 'NO') { // darle color de acuerdo a la condicion
        $(row).addClass('red');
        $('td', row).css('color', 'red');
        $('td', row).css('background-color', 'white');
      }
    },
    columnDefs: [
      {
        targets: -7, // penultima columna
        data: 'recuento',
        render: function (data, type, row) {
          if (data === '1') {
            return '<input type="checkbox" checked disabled>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        targets: -6, // penultima columna
        data: 'reclama',
        render: function (data, type, row) {
          if (data === '1') {
            return `<input type="checkbox" checked disabled>`;
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        targets: -5, // Última columna foto 1
        data: 'foto',
        render: function (data, type, row) {
          if (data === '1') {
            return `<input type="checkbox" class="chkFoto1" checked disabled>`;
          } else {
            return '<input type="checkbox" class="chkFoto1" disabled>';
          }
        }
      },
      {
        targets: -4, // Última columna foto 2
        data: 'foto2',
        render: function (data, type, row) {
          if (data === '1') {
            return `<input type="checkbox" class="chkFoto2" checked disabled>`;
          } else {
            return '<input type="checkbox" class="chkFoto2" disabled>';
          }
        }
      },
      {
        targets: -3, // Última columna foto 2
        data: 'foto3',
        render: function (data, type, row) {
          if (data === '1') {
            return `<input type="checkbox" class="chkFoto2" checked disabled>`;
          } else {
            return '<input type="checkbox" class="chkFoto2" disabled>';
          }
        }
      },
      {
        targets: -2, // Última columna foto 2
        data: 'fotrec',
        render: function (data, type, row) {
          if (data === '1') {
            return `<input type="checkbox" class="chkFoto4" checked disabled>`;
          } else {
            return '<input type="checkbox" class="chkFoto4" disabled>';
          }
        }
      },
      {
        targets: 8, // darle color a la columna especifica (el índice se cuenta desde 0)
        className: 'highlight', // Clase CSS para resaltar la columna
      },
    ],
    language: {
      lengthMenu: "Mostrar _MENU_ registros",
      zeroRecords: "No se encontraron resultados",
      info: "Registros del _START_ al _END_ de un total de  _TOTAL_",
      infoEmpty: "Encontrados 0 ",
      infoFiltered: "(de _MAX_ registros)",
      sSearch: "Buscar:",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Sig",
        sPrevious: "Ant",
      },
      sProcessing: "Procesando...",
    },
    stateSave: true,
    //para usar los botones
    responsive: "true",
    order: [
      [0, "asc"],
    ],
    ordering: false,
    select: true,
    searching: false,
    lengthChange: false,
  });

  //MUESTRA MODAL Evidencias de la mesa desde la row del DataTable
  $(document).on("click", ".btnEvidencias", function () {
    numPagina = tablaEnvios.page();
    fila = $(this).closest("tr");
    mCodigo = fila.find("td:eq(0)").text();
    mMesa = fila.find("td:eq(1)").text();

    existeReclama = datoSet.reclama;
    fotoReclama = datoSet.fotrec;
    existeFoto1 = datoSet.foto;
    existeFoto2 = datoSet.foto2;
    existeFoto3 = datoSet.foto3;

    table = $('#tab-control').DataTable();
    tr = $(this).closest('tr');
    rowData = table.row(tr).data();

    if (existeReclama === '1' && fotoReclama === '1') {
      btnFoto4.disabled = false;
      h6Foto4.innerHTML = "<em>La Foto</em> de la reclamación <strong>YA</strong> fue cargada";
    } else {
      if (existeReclama === '1' && fotoReclama === '0') {
        h6Foto4.innerHTML = "<em>La Foto</em> de la reclamación <strong>NO</strong> se ha cargado";
        btnFoto4.disabled = false;
      } else {
        h6Foto4.innerHTML = "<em>NO existe</em> reclamación para esta <strong>Mesa</strong>";
        btnFoto4.disabled = true;
      }
    }

    if (existeFoto1 === '1') {
      h6Foto1.innerHTML = "<em>La Foto</em> <strong>YA</strong> fue cargada";
    } else {
      h6Foto1.innerHTML = "<em>La Foto</em> <strong>NO</strong> se ha cargado";
    }

/* 
    if (existeFoto2 === '1') {
      h6Foto2.innerHTML = "<em>La Foto</em> de la segunda cara <strong>YA</strong> fue cargada";
    } else {
      h6Foto2.innerHTML = "<em>La Foto</em> de la segunda cara <strong>NO</strong> se ha cargado";
    }

    if (existeFoto3 === '1') {
      h6Foto3.innerHTML = "<em>La Foto</em> de la tercera cara <strong>YA</strong> fue cargada";
    } else {
      h6Foto3.innerHTML = "<em>La Foto</em> de la tercera cara <strong>NO</strong> se ha cargado";
    }
*/   
    document.getElementById('imageOriginal').src = '';
    document.getElementById('imageInput').value = '';

    $(".modal-header").css("background-color", " #6610f2");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Evidencias Mesa: " + mMesa);
    $("#modalEvidencias").modal("show");
  });


  //CAPTURA Reclamacion
  $(document).on("click", ".btnFoto4", function () {
    opcImagen = "4";
    document.getElementById('imageOriginal').src = '';
    document.getElementById('imageInput').value = '';

    $("#modalEvidencias").modal("hide");
    $(".modal-header").css("background-color", "#28a745");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Evidencia Reclamación -- mesa: " + mMesa);
    $("#modalFotoE14").modal("show");
  });

  //CAPTURA Foto 1 E-14
  $(document).on("click", ".btnFoto1", function () {
    opcImagen = "1";
    document.getElementById('imageOriginal').src = '';
    document.getElementById('imageInput').value = '';

    $("#modalEvidencias").modal("hide");
    $(".modal-header").css("background-color", "#28a745");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Foto E-14 cara 1 -- mesa: " + mMesa);
    $("#modalFotoE14").modal("show");
  });

  //CAPTURA Foto 2 E-14
  $(document).on("click", ".btnFoto2", function () {
    opcImagen = "2";
    document.getElementById('imageOriginal').src = '';
    document.getElementById('imageInput').value = '';

    $("#modalEvidencias").modal("hide");
    $(".modal-header").css("background-color", "#28a745");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Foto E-14 cara 2 -- mesa: " + mMesa);
    $("#modalFotoE14").modal("show");
  });

  //CAPTURA Foto 3 E-14
  $(document).on("click", ".btnFoto3", function () {
    opcImagen = "3";
    document.getElementById('imageOriginal').src = '';
    document.getElementById('imageInput').value = '';

    $("#modalEvidencias").modal("hide");
    $(".modal-header").css("background-color", "#28a745");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Foto E-14 cara 3 -- mesa: " + mMesa);
    $("#modalFotoE14").modal("show");
  });

  // Modal
  $(document).ready(function () {
    $("#modalEnvios").on('shown.bs.modal', function () {
      if (opcion == "new") {
        $("#mesa").focus();
      } else {
        $("#sufraga").focus();
      }
    });
  });

  //CANCELAR
  $(document).on("click", ".btnCancel", function () {
    btnEnviarE14.disabled = true;
    $("#modalEnvios").modal("hide");
    $("#modalFotoE14").modal("hide");
    $('#btnFoto').hide();
    limpiar();
  });

  //CREAR
  $("#btnAdd").click(function () {
    opcion = "new";
    mesa = null;

    $('#btnGrabar').show();
    $('#btnFoto').hide();
    //activar_voz();

    $("#formEnvio").trigger("reset");
    $("#mesa").attr("readonly", false);
    $("#mesa").attr("autofocus", true);
    $(".modal-header").css("background-color", "#E8F0FE");
    $(".modal-header").css("color", "black");
    $(".modal-title").text("Transmitir E-14");
    $(".btnGrabar").text("Enviar Datos");
    $("#modalEnvios").modal("show");
  });

  //BORRAR
  $(document).on("click", ".btnBorrar", function () {
    fila = $(this);
    mCodigo = $(this).closest("tr").find("td:eq(0)").text();
    Swal.fire({
      title: "Desea eliminar esta Mesa?",
      text: datoSet.mesa,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: "/envios/delete/" + mCodigo,
          method: "GET",
          data: { codigo: codigo },
          success: function () {
            var paginaActual = tablaEnvios.page();
            var indiceFila = tablaEnvios.data().count() - 1;
            tablaEnvios.row(fila.parents("tr")).remove().draw();
            //var filaBorrada = tablaEnvios.row(fila).remove().draw();

            if (indiceFila != -1) {
              var paginaNueva = Math.floor((indiceFila - 1) / tablaEnvios.page.len());
              tablaEnvios.page(paginaNueva).draw(false);
            }
          },
        });
      }
    });
  });

  //EDITAR
  $("#tab-control tbody").on("click", "tr", function () {
    var id = tablaEnvios.row(this).index();
    datoSet = tablaEnvios.row(this).data();
  });

  $(document).on("click", ".btnEditar", function () {
    $('#btnGrabar').show();
    $('#btnFoto').hide();

    opcion = "edit";
    fila = $(this).closest("tr");
    $("#mesa").attr("readonly", true);
    codigo = fila.find("td:eq(0)").text();
    mesa = datoSet.mesa;
    sufragos = datoSet.sufragos;
    can1 = datoSet.can1;
    can2 = datoSet.can2;
    can3 = datoSet.can3;
    can4 = datoSet.can4;
    can5 = datoSet.can5;
    can6 = datoSet.can6;
    can7 = datoSet.can7;
    blancos = datoSet.blancos;
    nulos = datoSet.nulos;
    nomarcado = datoSet.nomarcado;
    recuento = datoSet.recuento;
    reclama = datoSet.reclama;

    $("#mesa").val(mesa);
    $("#sufraga").val(sufragos);
    $("#votos1").val(can1);
    $("#votos2").val(can2);
    $("#votos3").val(can3);
    $("#votos4").val(can4);
    $("#votos5").val(can5);
    $("#votos6").val(can6);
    $("#votos7").val(can7);
    $("#votos8").val(blancos);
    $("#votos9").val(nulos);
    $("#votos10").val(nomarcado);
    $('[type=checkbox][name="recuento"]:checked').attr("value");
    $('[type=checkbox][name="reclama"]:checked').attr("value");

    const checkbox = document.getElementById('recuento');
    const checkbox2 = document.getElementById('reclama');

    if (recuento === '1') {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }

    checkbox.addEventListener('change', function () {
      if (this.checked) {
        this.value = '1';
      } else {
        this.value = '0';
      }
    });

    if (reclama === '1') {
      checkbox2.checked = true;
    } else {
      checkbox2.checked = false;
    }

    checkbox2.addEventListener('change', function () {
      if (this.checked) {
        this.value = '1';
      } else {
        this.value = '0';
      }
    });

    mMesa = fila.find("td:eq(1)").text();
    $(".modal-header").css("background-color", "#7303c0");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Editar Mesa: " +mMesa);
    $(".btnGrabar").text("Actualizar");
    $("#mesa").focus();
    $("#modalEnvios").modal("show");
  });

  //submit para CREAR y EDITAR
  $("#formEnvio").submit(function (e) {
    e.preventDefault();
    mesa = $.trim($("#mesa").val());
    sufragos = $.trim($("#sufraga").val());
    votos1 = $.trim($("#votos1").val());
    votos2 = $.trim($("#votos2").val());
    votos3 = $.trim($("#votos3").val());
    votos4 = $.trim($("#votos4").val());
    votos5 = $.trim($("#votos5").val());
    votos6 = $.trim($("#votos6").val());
    votos7 = $.trim($("#votos7").val());
    votos8 = $.trim($("#votos8").val());
    votos9 = $.trim($("#votos9").val());
    votos10 = $.trim($("#votos10").val());

    const checkbox = document.getElementById('recuento');
    const checkbox2 = document.getElementById('reclama');

    checkbox.addEventListener('change', function () {
      if (this.checked) {
        this.value = '1';
      } else {
        this.value = '0';
      }
    });

    checkbox2.addEventListener('change', function () {
      if (this.checked) {
        this.value = '1';
      } else {
        this.value = '0';
      }
    });

    validarDatos();
    if (!pasar) { return }
    crearJSON();
    data = {
      registros: registros
    }

    if (opcion == "new") {
      //$("#mesa").focus();
      $.ajax({
        url: "/envios/grabar/" + myllave,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (res) {
          try {

            if (res === "Fallo") {
              Swal.fire("Datos de esa mesa, YA se transmitieron...", "", "error");
              mymesa.value = '';
            } else {
              Swal.fire('Los Datos se Transmitieron Exitosamente...', '', 'success');

              //$('#btnGrabar').hide();
              //$('#btnFoto').show();
              $("#modalEnvios").modal("hide");

              // Dar tiempo para que termine la recarga antes de ejecutar tu lógica
              setTimeout(function () {
                // Aquí puedes realizar la búsqueda de la fila y otras operaciones
                var indiceFila = -1;
                tablaEnvios.rows().every(function (rowIdx, tableLoop, rowLoop) {
                  var rowData = this.data();
                  if (rowData.codigo == myllave) {
                    indiceFila = rowIdx;
                    return false;
                  }
                });

                if (indiceFila != -1) {
                  var paginaNueva = Math.floor(indiceFila / tablaEnvios.page.len());
                  tablaEnvios.page(paginaNueva).draw(false);
                }
              }, 500); // Tiempo en milisegundos (ajusta según sea necesario)

              // Recargar DataTable después de completar el proceso
              tablaEnvios.ajax.reload(null, false);
            }
          } catch (error) {
            console.error("Error:", error);
          }
        },
      });
    }

    if (opcion == "edit") {
      $("#votos1").attr("autofocus", true);
      const btnEnabled = $.ajax({
        url: "/envios/update/" + myllave,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (res) {
          tablaEnvios.ajax.reload(null, false);
          Swal.fire("La mesa se Actualizo Correctamente!", "", "success");
        },
      });

      $("#modalEnvios").modal("hide");
    }

  });

  //GRABA FOTO E-14 - submit para la captura del E-14
  $(document).on("click", ".btnEnviarE14", function () {

    let imgElement = document.getElementById('imageOriginal');
    let base64Image = getBase64FromImgElement(imgElement);
    const btnFotoE14 = $(this);

    data = {
      imagen: base64Image
    }

    $.ajax({
      url: "/envios/grabae14/" + mCodigo + '/' + opcImagen,
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      data: data,
      success: function (res) {                   //si la petición fue exitosa
        if (res === "OK") {

          switch (opcImagen) {
            case "1":
              Swal.fire('La Foto 1 del E-14 se Guardo Correctamente!', '', 'success');
              tablaEnvios.ajax.reload(function () {
                // Manejar el cambio de estado de los checkboxes después de recargar los datos
                $(".chkFoto1").on("change", function () {
                  var fila = tablaEnvios.row($(this).closest("tr"));
                  var valorCheckbox = $(this).prop("checked") ? '1' : '0';
                  fila.data().foto = valorCheckbox;
                });
              }, false);
              h6Foto1.innerHTML = "<em>La Foto</em> de la primera cara <strong>YA</strong> fue cargada";
              break;

            case "2":
              Swal.fire('La Foto 2 del E-14 se Guardo Correctamente!', '', 'success');
              tablaEnvios.ajax.reload(function () {
                // Manejar el cambio de estado de los checkboxes después de recargar los datos
                $(".chkFoto2").on("change", function () {
                  var fila = tablaEnvios.row($(this).closest("tr"));
                  var valorCheckbox = $(this).prop("checked") ? '1' : '0';
                  fila.data().foto2 = valorCheckbox;
                });
              }, false);
              h6Foto2.innerHTML = "<em>La Foto</em> de la segunda cara <strong>YA</strong> fue cargada";
              break;

            case "3":
              Swal.fire('La Foto 3 del E-14 se Guardo Correctamente!', '', 'success');
              tablaEnvios.ajax.reload(function () {
                // Manejar el cambio de estado de los checkboxes después de recargar los datos
                $(".chkFoto").on("change", function () {
                  var fila = tablaEnvios.row($(this).closest("tr"));
                  var valorCheckbox = $(this).prop("checked") ? '1' : '0';
                  fila.data().foto = valorCheckbox;
                });
              }, false);
              h6Foto3.innerHTML = "<em>La Foto</em> de la tercera cara <strong>YA</strong> fue cargada";
              break;

            case "4":
              Swal.fire('La Foto de la reclamación se Guardo Correctamente!', '', 'success');
              tablaEnvios.ajax.reload(function () {
                // Manejar el cambio de estado de los checkboxes después de recargar los datos
                $(".chkFoto4").on("change", function () {
                  var fila = tablaEnvios.row($(this).closest("tr"));
                  var valorCheckbox = $(this).prop("checked") ? '1' : '0';
                  fila.data().fotrec = valorCheckbox;
                });
              }, false);
              h6Foto4.innerHTML = "<em>La Foto</em> de la reclamación <strong>YA</strong> fue cargada";
              break;
          }

        }
      },
      error: function (error) {
        // Manejar el caso de error si es necesario
        console.log('Error en la petición AJAX', error);
      }
    });

    $(".modal-header").css("background-color", " #6610f2");
    $(".modal-title").text("Evidencias Mesa: " + mMesa);
    $('#modalEvidencias').modal('show');
    $('#modalFotoE14').modal('hide');
    btnEnviar14.disabled = true;
  });
});


/* 
{
  defaultContent: `<a href="#" class="material-icons btnEditar text-primary" title="Actualizar">create</a>
                   <a href="#" class="material-icons btnBorrar text-danger" title="Eliminar">delete</a>
                   <a href="#" class="material-icons btnFotoE14 text-success" title="Captura E-14">image</a>
                   <a href="#" class="material-icons btnFotReclama text-warning" title="Reclamación">edit_note</a>`,
}, */

/*
defaultContent: `<a href="#" class="btnEditar text-primary" title="Actualizar"><i class="fas fa-edit"></i></a>
                         <a href="#" class="btnBorrar text-danger" title="Eliminar"><i class="fas fa-trash-alt"></i></a>
                         <a href="#" class="btnFotoE14 text-success" title="Captura E-14"><i class="fas fa-image"></i></a>
                         <a href="#" class="btnFotReclama text-warning" title="Reclamación"><i class="far fa-list-alt"></i></a>`,

      {
        targets: -5, // penultima columna
        data: 'reclama',
        render: function (data, type, row) {
          if (data === '1') {
            return `<input type="checkbox" checked disabled>
            <span class="badge bg-primary badge-number">1</span>`;
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },


*/