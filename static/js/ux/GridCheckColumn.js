/**
 * @class Ext.ux.CheckColumn
 * @extends Ext.grid.column.Column
 * A Header subclass which renders a checkbox in each column cell which toggles the truthiness of the associated data field on click.
 */

Ext.define('ProtoUL.ux.CheckColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.mycheckcolumn',

    /**
     * @cfg {Boolean} [stopSelection=true]
     * Prevent grid selection upon mousedown.
     */
    stopSelection: true,

    tdCls: Ext.baseCSSPrefix + 'grid-cell-checkcolumn',

    constructor: function() {
        this.addEvents(
            /**
             * @event beforecheckchange
             * Fires when before checked state of a row changes.
             * The change may be vetoed by returning `false` from a listener.
             * @param {Ext.ux.CheckColumn} this CheckColumn
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is to be checked
             */
            'beforecheckchange',
            /**
             * @event checkchange
             * Fires when the checked state of a row changes
             * @param {Ext.ux.CheckColumn} this CheckColumn
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is now checked
             */
            'checkchange'
        );
        this.callParent(arguments);
    },

    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        var me = this,
            key = type === 'keydown' && e.getKey(),
            mousedown = type == 'mousedown';
        
        if (mousedown || (key == e.ENTER || key == e.SPACE)) {
            
            // Propiedad readOnly de la grilla 
            if ( this.readOnly ) {  return false  }
            if ( this.inGrid ) { 
                if ( ! this.ownerCt.ownerCt.ownerCt.editable  ) return false 
            }
            
            
            var record = view.panel.store.getAt(recordIndex),
                dataIndex = me.dataIndex,
                checked = !record.get(dataIndex);

            // Allow apps to hook beforecheckchange
            if (me.fireEvent('beforecheckchange', record, recordIndex, checked) !== false) {
                record.set(dataIndex, checked);
                me.fireEvent('checkchange', record, recordIndex, checked);

                // Mousedown on the now nonexistent cell causes the view to blur, so stop it continuing.
                if (mousedown) {
                    e.stopEvent();
                }

                // Selection will not proceed after this because of the DOM update caused by the record modification
                // Invoke the SelectionModel unless configured not to do so
                if (!me.stopSelection) {
                    view.selModel.selectByPosition({
                        row: recordIndex,
                        column: cellIndex
                    });
                }

                // Prevent the view from propagating the event to the selection model - we have done that job.
                return false;
            } else {
                // Prevent the view from propagating the event to the selection model if configured to do so.
                return !me.stopSelection;
            }
        } else {
            return me.callParent(arguments);
        }
    },

    // Note: class names are not placed on the prototype bc renderer scope
    // is not in the header.
    renderer : function(value){
        var cssPrefix = Ext.baseCSSPrefix,
            cls = [cssPrefix + 'grid-checkheader'];

        if (value) {
            cls.push(cssPrefix + 'grid-checkheader-checked');
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    }
});




/*

 * @class ProtoUL.ux.GridCheckColumn
 * @extends Ext.grid.column.Column
 * <p>A Header subclass which renders a checkbox in each column cell</p>
 
A diferencia del CheckColmn, esta clase no maneja eventos, pues corresponde a la presentacion en la grilla,  
La edicion se hace mediante un checkbox ya sea en modo celda o fila. 
 
 * <p>Example usage:</p>
 * <pre><code>
// create the grid
    columns: [{
           xtype: 'checkcolumnreadonly',
           text: 'Indoor?',
           dataIndex: 'indoor',
           width: 55
     }...]
*/

// Ext.define('ProtoUL.ux.GridCheckColumn', {
    // extend: 'Ext.grid.column.Column',
    // alias: 'widget.checkcolumnreadonly',
    // // Note: class names are not placed on the prototype bc renderer scope
    // // is not in the header.
    // renderer : function(value){
        // var cssPrefix = Ext.baseCSSPrefix,
            // cls = [cssPrefix + 'grid-checkheader'];
        // if (value) {
            // cls.push(cssPrefix + 'grid-checkheader-checked');
        // }
        // return '<div class="' + cls.join(' ') + '">&#160;</div>';
    // }
// });


