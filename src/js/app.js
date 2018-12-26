import $ from 'jquery';
import {traverse} from './code-analyzer';
import {input_vector} from './code-analyzer';
const Viz=require('viz.js');

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = traverse(codeToParse);
        let graph=Viz('digraph { '+parsedCode+' }');
       
        $('#parsedCode').html(graph);
    });

    $('#codeSubmissionParams').click(() => {
        let param_name = $('#Param_name').val();
        let param_value = $('#Param_value').val();
        input_vector.set(param_name, param_value);
        $('#Param_name').val('');
        $('#Param_value').val('');
    });
}

);
