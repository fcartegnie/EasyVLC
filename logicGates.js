var VLCModulesLang = {

	layerOptions: { "layerMap": false },	
	languageName: "VLCModules",
	modules: [
		{
			"name": "Core",
			"category": "Core",
			"description": "Core",
			"container" : {
				"xtype":"AccessModuleContainer", 
				"icon": "images/core.png",
				"image": "images/core.png",
  				"terminals": [
  					{"name": "_INPUT1", "direction": [-1,0], "offsetPosition": {"left": -16, "top": -2 },"ddConfig": {"type": "input","allowedTypes": ["output"]} },
  					{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": {"left": 65, "top": -2 },"ddConfig": {"type": "output","allowedTypes": ["vout_input"]}}
  				]
			}
		}
/*		{
			"name": "v4l2",
			"category": "access",
			"description": "V4L2 Access",
			"container" : {
				"xtype":"AccessModuleContainer", 
				"icon": "images/gate_and.png",
				"image": "images/gate_and.png",
  				"terminals": [
  					{"name": "_INPUT1", "direction": [-1,0], "offsetPosition": {"left": -16, "top": -2 },"ddConfig": {"type": "input","allowedTypes": ["output"]}, "nMaxWires": 1 },
  					{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": {"left": 65, "top": 12 },"ddConfig": {"type": "output","allowedTypes": ["vout_input"]}}
  				]
			}
		},
		{
			"name": "v4l2",
			"category": "vout",
			"description": "V4L2 vout",
			"container" : {
				"xtype":"ModuleContainer", 
				"icon": "images/gate_and.png",
				"image": "images/gate_and.png",
  				"terminals": [
  					{"name": "_INPUT1", "direction": [-1,0], "offsetPosition": {"left": -16, "top": -2 },"ddConfig": {"type": "input","allowedTypes": ["output"]}, "nMaxWires": 1 },
  					{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": {"left": 65, "top": 12 },"ddConfig": {"type": "output","allowedTypes": ["input"]}}
  				]
			}
		},
		{
			"name": "v4l2___",
			"category": "vout",
			"description": "V4L2 vout2",
			"container" : {
				"xtype":"WireIt.FormContainer",
				"title": "WireIt.FormContainer demo",
				"icon": "images/gate_and.png",
       		"fields": [
         		{"type": "type", "inputParams": {"label": "Value", "name": "input", "wirable": false, "value": "" }},
					{inputParams: {label: 'Firstname', name: 'firstname' }}
       		],
  				"terminals": [
  					{"name": "_INPUT1", "direction": [-1,0], "offsetPosition": {"left": -16, "top": -2 },"ddConfig": {"type": "vout_input","allowedTypes": ["output"]}, "nMaxWires": 1 }/*,
  					{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": {"left": 65, "top": 12 },"ddConfig": {"type": "output","allowedTypes": ["input"]}}
  				],
				"legend": "Tell us about yourself..."
			}
		}*/
	]
};


/********
 * CODE
 ********/

ModuleContainer = function(opts, layer) {
	ModuleContainer.superclass.constructor.call(this, opts, layer);
	this.logicInputValues = [];
};
YAHOO.lang.extend(ModuleContainer, WireIt.ImageContainer, {
	
	setOptions: function(options) {
      ModuleContainer.superclass.setOptions.call(this, options);
      this.options.xtype = "ModuleContainer";
   },
	
	setInput: function(bStatus,term) {
		this.logicInputValues[term.options.name] = bStatus;
	},

	switchStatus: function() {

	}
});

AccessModuleContainer = function(opts, layer) {
	AccessModuleContainer.superclass.constructor.call(this, opts, layer);
	this.imageName = "clock";
};
YAHOO.lang.extend(AccessModuleContainer, ModuleContainer, {
	ddConfig: { type: "input", allowedTypes: ["output"] },
	nMaxWires: 1,
	setOptions: function(options) {
      AccessModuleContainer.superclass.setOptions.call(this, options);
      this.options.xtype = "AccessModuleContainer";
   }
});

function run()
{
try {
	var editor = new WireIt.WiringEditor(VLCModulesLang);
      var toolbar = YAHOO.util.Dom.get('toolbar');
      var runButton = new YAHOO.widget.Button({ label:"Run", id:"WiringEditor-runButton", container: toolbar });
      runButton.on("click", function(){ alert(YAHOO.lang.JSON.stringify(editor.getValue())); }, editor, true);
}catch(ex) {
	console.log(ex);
}
}

function getfields(config)
{
	var toreturn = [];
	for( var name in config )
	{
		if ( typeof(config[name])!='object' )
		{
			entry = { "inputParams": {"label": name, "value": config[name] }};
		}
		else
		{
			var select = [];
			for( var x in config[name] )
				select.push(x);
			entry = { "type": "select", "inputParams": {"type": "select", "label": name, "name": name, "selectValues": select }};
		}
		toreturn.push( entry );
	}
	return toreturn;
}

function processmodule(item)
{
	var entry = {};
	entry.name = item.longtext;
	entry.category = item['subcategory'];
	entry.description = item.longtext;
	entry.container = {
				"xtype":"WireIt.FormContainer",
				"title": item['name'],
				"fields": getfields(item['config']),
  				"terminals": [
  					{"name": "_INPUT1", "direction": [-1,0], "offsetPosition": {"left": -16, "top": -2 },"ddConfig": {"type": "vout_input","allowedTypes": ["output"]}, "nMaxWires": 1 },
  					{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": {"left": 300, "top": -2 },"ddConfig": {"type": "output","allowedTypes": ["input"]}, "nMaxWires": 1 }
  				]//,
				//"legend": "Tell us about yourself..."
	};
	VLCModulesLang.modules[VLCModulesLang.modules.length] = entry;
}

function processmodulesdata(modules, target)
{
	for( var id in modules )
	{
		processmodule( modules[id] );
	}
	run();
}


YAHOO.util.Event.onDOMReady( function() { 
	var vlcdata;
	var objTransaction = YAHOO.util.Connect.asyncRequest('GET', "config.json", {
		success: function(o) {
			vlcdata = YAHOO.lang.JSON.parse(o.responseText);
			processmodulesdata(vlcdata, VLCModulesLang.modules);
		}
	}, null);
});
