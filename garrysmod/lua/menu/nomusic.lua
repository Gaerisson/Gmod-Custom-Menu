
--[[ 

	file name: menu/nomusic.lua
	reason: 
		to remove all that shitty music from shitty server's shitty loading screens they bought
		on scriptfucker™
	
	remember to add an include for this file in menu/menu.lua!
	
]]

--[[
	SETTINGS:
		alternate_iframe:
			used when shouldremove = false
			this will basically reroute the videos/sounds to the specified link
		shouldremove:
			if true it will simply remove the sounds/videos, otherwise it will use the other values in the settings
]]

local SETTINGS = {
	shouldremove = true;
	alternate_iframe = "https://www.youtube.com/embed/qycqF1CWcXg?autoplay=1";
};


local success	= Color(0,200,0,255);
local failure	= Color(200,0,0,255);
local middle	= Color(200,0,200,255); -- purple :)
local loadp = (GetLoadPanel or function() end)(); -- hopefully no change...
if(not loadp) then MsgC(failure, "Couldn't get pnlLoading! Not stopping sounds! :(\n"); end
MsgC(middle, "Got pnlLoading.. executing code to stop sounds...\n");

local ThinkName = "ThinkLoad";
local javascript = [[
	var amount = 0;
	function DeleteAll(name) {
		var all = document.getElementsByTagName(name);
		for(var i = 0; i < all.length; i++) {
			amount = amount + 1;
			all[i].parentElement.removeChild(all[i]);
		}
	}
	function KillSrc(name) {
	]]..(SETTINGS.shouldremove and [[
		DeleteAll(name);
	]] or [[
	var all = document.getElementsByTagName(name);
		for(var i = 0; i < all.length; i++) {
			amount = amount + 1;
			all[i].src = ']]..SETTINGS.alternate_iframe:JavascriptSafe()..[[';
		}
	]])..[[
	}
	KillSrc("iframe");
	DeleteAll("audio");
	KillSrc("source");
	console.log("Removed "+amount+" elements!");
]];
local overwrite = [[
	var old = document.createElement;
	document.createElement = function(tagname) {
		tagname = tagname.toLowerCase();
		if(tagname === "iframe" || tagname === "audio" || tagname === "source") {
			return; // sorry i am too lazy to redirect this to our stuff
		}
		return old(tagname);
	};
	console.log("Overwrote document.createElement :)!");
]];

local hasoverwritten = false;

local function ThinkLoad()
	if(not IsValid(loadp)) then hook.Remove("Think", ThinkName); return; end
	if(not IsValid(loadp.HTML)) then return; end -- wait for it
	if(hasoverwritten == false) then
		loadp.HTML:RunJavascript(overwrite);
		MsgC(success, "Overwrote document.createElement - ;)\n");
		hasoverwritten = true;
	end
	if(loadp.HTML:IsLoading()) then return; end -- wait for the load!
	loadp.HTML:RunJavascript(javascript);
	MsgC(success, "Removed all audio elements!\n");
	hook.Remove("Think", ThinkName); 
end

local old_showurl = loadp.ShowURL;
function loadp:ShowURL(a,b,c,d,e,f)
	MsgC(middle, "ShowURL called!\n");
	local ret = old_showurl(self,a,b,c,d,e,f);
	hasoverwritten = false;
	hook.Add("Think", ThinkName, ThinkLoad);
	return ret;
end
MsgC(success, "All code executed successfully!\n");

--scriptfucker and all other trademarks are property of their respective owners
