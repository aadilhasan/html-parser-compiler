/**
 * Created by aadil on 8/26/17.
 */

function lexical_analysis(template){

    var state = {
        str: template,
        tokens : [],
        current : 0
    };

    lex_state(state);

}


function lex_state(state){

    var current = state.current,
        str = state.str,
        len = state.str.length;

    while(current < len){

        if(str.charAt(current) == "<"){

            get_tag(state);
            continue;

        }else if(str.charAt(current) == " "){

            current++;
            continue;
        }else{

            console.error(" Cannot find starting tag in the template ");

        }
    }
}



function get_tag(state){

    var str = state.str,
        len = state.str.length;

    var is_tag_starting = str.charAt(state.current+1) == "/";
    state.current += is_tag_starting ? 2 : 1;

    var tag_token = get_tag_name(state);
    get_tag_attributes(tag_token, state);

    var is_tag_closing = str.charAt(state.current) == "/";
    state.current += is_tag_closing ? 2 : 1;

    if(is_tag_starting){
        tag_token.tag_starting = true;
    }

    if(is_tag_closing){
        tag_token.tag_closing = true;
    }

}

function get_tag_name(state){

    var current = state.current, len = state.str.length, str = state.str, tag_name = '';
    while(current < len){
        var char = str.charAt(current);
        if(cahr == "/" || char == " " || char == ">"){
            break;
        }else{
            tag_name+=char;
        }
        current++;
    }

    state.current = current;
    var tag_token = {
        type : 'tag',
        value : tag_name
    };
    return tag_token;

}


function get_tag_attributes(tag_token, state){

    var str = state.str,
        len = state.str.length,
        current = state.current,
        char = str.charAt(current),
        nextChar = str.charAt(current+1),
        attributes = {};

    function increment(){
        current++;
        char = str.charAt(current);
        nextChar = str.charAt(current+1);
    }


    while(current < len){

        if(char == ">" || (char == "/" && nextChar == ">")){
            break;
        }

        if(char == " "){
            increment();
            continue;
        }
        var attribute_name = "", no_value_in_tag = false;

        while(current < len && char !== "="){
            if(char == " " || (char == "/" && nextChar == ">")){
                no_valuew_in_tag = true;
                break;
            }
            attribute_name+=char;
            increment();
        }

        // skip "="
        increment();

        var attribute_value = {
            name : attribute_name,
            value : '',
            meta : {}
        };

        if(no_value_in_tag){
            attributes[attribute_name] = attribute;
            continue;
        }

        var quote_type = "";
        if( char == "'" || char == "\""){

            quote_type = char;
            increment();

        }


        while( char < len && char !== quote_type){

            attribute_value.value += char;
            increment();

        }

        //skip quote end
        increment();

        var dot_index = attribute_name.indexOf(":");
        if(dot_index !== -1){
            var temp = attribute_name.split(dot_index);
            attribute_value.name = temp[0];
            attribute_value.meta.args = temp[1];
        }
        attributes[attribute_name] = attribute_value;
    }

    state.current = current;
    tag_token = attributes;

}