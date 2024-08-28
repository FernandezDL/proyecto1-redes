import React from "react"; // Importa React
import "../addContact/addContact.css"; // Importa los estilos CSS para el componente

// Componente para mostrar una advertencia antes de eliminar una cuenta
export default function EliminarCuenta({ closePopup, eliminarCuenta }) {
    return (
        <div className="popupContainer"> {/* Contenedor principal del popup */}
            <div className="popupContent"> {/* Contenedor del contenido del popup */}
                <h2>¡Cuidado!</h2> {/* Título de advertencia */}
               
                <h3>Vas a eliminar tu cuenta</h3> {/* Mensaje de advertencia */}
                <h3>¿Seguro que quieres seguir?</h3> {/* Confirmación adicional */}

                <div className="horizontalContainer"> {/* Contenedor para los botones */}
                    <button className="addbttn" onClick={closePopup}>Regresar</button> {/* Botón para cerrar el popup y regresar */}
                    <button className="closebttn" onClick={eliminarCuenta}>Eliminar cuenta</button> {/* Botón para confirmar la eliminación de la cuenta */}
                </div>
            </div>
        </div>
    );
}
