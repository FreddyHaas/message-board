# message-board

        <% if (errors) {
            for(let i=0; i < errors.length; i++) { %>
            <p id="error-message"> <%= errors[i].msg %> </p>
        <% } }%>