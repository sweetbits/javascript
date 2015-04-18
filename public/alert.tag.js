<alert>
    <div style="display:none" class="alert fade in alert-danger" role="alert">
        <button type="button" class="close" aria-label="Close" onclick={ hide }><span aria-hidden="true">&times;</span></button>
        <strong>There was a problem:</strong> { opts.message }
    </div>

    this.on('show', function () {
        $('.alert', this.root).slideDown();
    });

    hide() {
        $('.alert', this.root).hide();
    }

</alert>
