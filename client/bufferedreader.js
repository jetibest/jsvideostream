(function(root, factory)
{
    if(typeof define === 'function' && define.amd)
    {
        define(['eventlistener'], factory);
    }
    else if(typeof exports === 'object')
    {
        module.exports = factory(require('eventlistener'));
    }
    else
    {
        root.bufferedreader = factory(root.eventlistener);
    }
}(this, function(eventlistener)
{
    var self = {};
    self.create = function(args)
    {
        args = args || {};
        
        var br = eventlistener.create({
            type: 'type' in args ? args.type : 'String',
            delimiter: 'delimiter' in args ? args.delimiter : '\n',
            linequeue: []
        });
        var txtEnc = typeof TextEncoder === 'function' ? new TextEncoder() : {encode: function(str){return Uint8Array.from(str, function(c){return c.codePointAt(0);});}};
        var typeconvert = function(ln){return ln};
        br.settype = function(type)
        {
            if(br.type === 'Uint8Array')
            {
                br.type = type;
                typeconvert = function(ln){return txtEnc.encode(ln);};
            }
            else if(br.type === 'String')
            {
                br.type = type;
                typeconvert = function(ln){return ln;};
            }
        };
        br.setdelimiter = function(sep)
        {
            br.delimiter = sep;
            if(sep.length === 1)
            {
                br.checklineseparator = function(str, i)
                {
                    return str.charAt(i) === sep ? 1 : 0;
                };
            }
            else
            {
                br.checklineseparator = function(str, i)
                {
                    return i + sep.length <= str.length && str.substring(i, i + sep.length) === sep ? sep.length : 0;
                };
            }
        };
        br.writestr = function(str)
        {
            var off = 0;
            for(var i=0;i<str.length;++i)
            {
                var c = br.checklineseparator(str, i);
                if(c > 0)
                {
                    if(br.linequeue.length)
                    {
                        br.fire('line', typeconvert(br.linequeue.join('') + str.substring(off, i)));
                        br.linequeue = [];
                    }
                    else
                    {
                        br.fire('line', typeconvert(str.substring(off, i)));
                    }
                    off = i + c;
                }
            }
            if(off < str.length)
            {
                br.linequeue.push(str.substring(off));
            }
        };
        br.writebytes = function(bytearray)
        {
            var str = [];
            for(var i=0;i<bytearray.length;++i)
            {
                str.push(String.fromCharCode(bytearray[i]));
            }
            return br.writestr(str.join(''));
        };
        br.error = function(err)
        {
            br.errorValue = err;
            br.fire('error', br.errorValue);
        };
        br.reset = function()
        {
            br.errorValue = false;
        };
        br.close = function()
        {
            if(!br.errorValue && br.linequeue.length)
            {
                br.fire('line', typeconvert(br.linequeue.join('')));
            }
            br.fire('close', br.errorValue, typeconvert(br.linequeue.join('')));
        };
        br.settype(br.type);
        br.setdelimiter(br.delimiter);
        return br;
    };
    return self;
}));
