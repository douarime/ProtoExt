/* 
 * ProtoDetailSelector,  Selecciona los detalles posibles   
 *    
 * 1.  presentar el arbol de campos para seleccionar los detalles
 * 
 */

Ext.define('ProtoUL.proto.ProtoDetailSelector', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.protoDetailSelector',

// Contenedor para probar el arbol de detalles 
    
// @protoOption   Required 
    protoOption : null, 

 // @myMeta   Required 
    myMeta : null, 

    initComponent: function() {
        
        me = this; 
        
        var detailTree = Ext.create('ProtoUL.proto.ProtoDetailTree', {
            protoOption : me.protoOption, 
            myMeta : me.myMeta 
           })


        detailTree.on({
            'loadComplete': function (  treeStore, records,  successful,  eOpts ) {
                // configureCurrentDetails()
            }, 
            'checkModif': function (  node,  checked,  eOpts ) {
                // var idx = node.get( 'id' )
            }, 
            scope: me }
        );

        var tBar =  Ext.create( 'ProtoUL.proto.ProtoToolBar', {dock : 'top'})

        Ext.apply(this, {
            layout: 'fit',
            items: detailTree, 
            dockedItems: [ tBar ] 
        });
          
        this.callParent(arguments);
        
    } 


});




/* 
 * Lectura del arbol de detalles 
 * 
 */

Ext.define('ProtoUL.proto.ProtoDetailTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.protoDetailTree',
    

 // @protoOption   Required 
    protoOption : null, 

//  @myMeta   Required 
    myMeta : null, 

    initComponent: function() {
        
        me = this; 
        me.addEvents('checkModif', 'loadComplete');
        
        definieProtoDetailsTreeModel( me.protoOption  )
        
        this.treeStore = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            model: 'Proto.DetailsTreeModel',
            root: {
                text:'details',
                expanded: true 
            }, 

            listeners: {
                load: function ( treeStore, records,  successful,  eOpts ) {
                    configureCurrentDetails()
                    me.fireEvent('loadComplete', treeStore, records,  successful,  eOpts );
                }
            }
             
        });

        var tree = Ext.apply(this, {
            store: this.treeStore,
            useArrows: true,
            rootVisible: false ,
            minWidth: 400, 

            columns: [{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: 'text',
                flex: 2,
                sortable: true,
                minWidth: 200,
                dataIndex: 'id'
            },{
                flex: 2,
                text: 'detailField',
                dataIndex: 'detailField'
            },{
                flex: 1,
                text: 'conceptDetail',
                dataIndex: 'conceptDetail'
            }] 

             
        })

        tree.on({
            'checkchange': {fn: function (  node,  checked,  eOpts ) {
                me.fireEvent('checkModif', node,  checked,  eOpts );
            }}, scope: me }
        );

        me.callParent(arguments);
        
        function configureCurrentDetails() {
            // Crea los campos activos en la grilla 
            for (var ix in me.myMeta.protoDetails ) {
                var vFld  =  me.myMeta.protoDetails[ix];
                // var vNode =  me.treeStore.getNodeById( vFld.name ) 
                // if ( vNode ) vNode.set( 'checked', true ) 
            } 
        }
        
        
    }, 

    getCheckedList: function () {

        var records = this.getView().getChecked(),
            names = [];
        
        Ext.Array.each(records, function(rec){
            names.push(rec.get('id'));
        });
        
        return names 

    }


});