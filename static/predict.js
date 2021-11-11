$("#image-selector").change(function(){
    let reader = new FileReader() ;
    reader.onload =  function(){
        let dataurl = reader.result ;
        $(`#selected-image`).attr("src",dataurl) ;
        $("#prediction-list").empty() ;
    }

    let file = $("#image-selector").prop('files')[0] ;
    reader.readAsDataURL(file) ;
}) ;

let model ;
(async function(){
    model = await tf.loadLayersModel('./tfjs_cnn_model/model.json') ;
    $('.progress-bar').hide() ; 
})() ;

$("#predict-button").click(async function(){
    let img = $('#selected-image').get(0) ;

    let tensor = tf.browser.fromPixels(img)
        .mean(2)
        .expandDims(-1)
        .resizeNearestNeighbor([100,100]) 
        .expandDims(0)
        .cast('float32')
        .div(tf.scalar(255));
        
        

    // console.log(tensor)

    let  Classnames = ['COVID', 'Lung_Opacity', 'Normal', 'Viral Pneumonia'] 
    let predictions = await model.predict(tensor).data() ;
    console.log(predictions)
    let top4 = Array.from(predictions)
        .map(function(p,i){
            return {
                probability:p ,
                className:Classnames[i]
            };
        }).sort(function(a,b){
            return b.probability - a.probability
        }).slice(0, 5);

        $("#prediction-list").empty() ;
        top4.forEach(function(p){
            $('#prediction-list').append(`<li>${p.className}  :  ${p.probability.toFixed(6)}  </li>`)
        });
})