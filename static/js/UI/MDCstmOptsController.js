Ext.define('ProtoUL.UI.MDCstmOptsController', {
    extend: 'Ext.Base',
    myMeta : null, 
    constructor: function (config) {
        Ext.apply(this, config || {});
        this.getCustomOptsBar()
    }, 

    getCustomOptsBar: function() {
        
        var myFilters = []  
        var tmpFilters = [] 
        var __MasterDetail = this.__MasterDetail
        
        // Si no hay filtros definidos pero existe un filterAlph, 
        if ((this.myMeta.gridConfig.filtersSet.length == 0)  &&  this.myMeta.gridConfig.filterSetABC  ) {

            for (var nFiltre in oc(['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'])) {
                var tmpF1 = {}
                tmpF1[ this.myMeta.gridConfig.filterSetABC + '__istartswith' ] =  nFiltre 
                tmpFilters.push ({ name: nFiltre,  filter: tmpF1 }) 
            }
            tmpFilters.push ({ name: ' *', filter: {} })
             
        } else {
          tmpFilters = this.myMeta.gridConfig.filtersSet  
        }  

        for (var vDet in tmpFilters ) {       

            var pFilters = tmpFilters[ vDet ]
            myFilters.push (
                new Ext.Action({
                    text:           pFilters.name,
                    iconCls :       pFilters.icon, 
                    maxWidth :      100, 
                    protoFilter:    Ext.encode( pFilters.filter ),
                    scope:          this,                     
                    handler:        onClickProtoFilter
                }));

        };


        if ( myFilters.length > 0  ) {

            __MasterDetail.tbFilters = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden : true,
                enableOverflow : true, 
                items: [
                    {
                    xtype   : 'tbtext',
                    text: '<b>Filtrer par :<b>'
                    }
                ]
            });

            __MasterDetail.tbFilters.add ( myFilters )
            __MasterDetail.myFilters = myFilters
            __MasterDetail.protoMasterGrid.addDocked( __MasterDetail.tbFilters )

        }; 
        
        function onClickProtoFilter( btn ){
            __MasterDetail.protoMasterGrid.protoLocalFilter = ' " ' +  btn.text + ' "'; 
            __MasterDetail.protoMasterGrid.setGridTitle( __MasterDetail.protoMasterGrid ) 
            __MasterDetail.onClickLoadData( btn.protoFilter );
        }
        
        

// ------------------------------------------------------------------------------------------------
// 
        // var tbViews = Ext.getCmp( ideTbViews )
        // tbViews.add({
            // xtype: 'tbtext',
            // iconCls : 'icon-views', 
            // text: '<b>Group de colonnes :<b>'
            // // },{  xtype: 'menuseparator'
        // });
// 
        // function configurelistDisplaySet(){
// 
            // var bHide = true; 
// 
            // // Agrega la vista por defecto 
            // var myDefaultCols = myMeta.gridConfig.listDisplay;
            // if ( myDefaultCols.length > 0 ) {
                // tbViews.add({
                    // text:       _defaultViewText,
                    // protoView:  myDefaultCols ,
                    // handler:    onClickChangeView
                // });
            // }
//             
            // var pViews = myMeta.gridConfig.listDisplaySet;
            // for (var vDet in pViews) {         
                // tbViews.add({
                    // text:       vDet ,
                    // protoView:  pViews[vDet] ,
                    // handler:    onClickChangeView
                // });
                // bHide = false; 
            // }
//             
            // // if ( bHide) {
                // // var btViews = Ext.getCmp( ideBtViews );
                // // btViews.hidden = true
            // // }
        // }
//     
        // configurelistDisplaySet(); 
        
    }
    
}) 