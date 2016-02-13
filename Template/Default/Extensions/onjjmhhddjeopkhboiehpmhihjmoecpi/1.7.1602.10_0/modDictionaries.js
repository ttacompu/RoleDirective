/**
 *  OneLog dictionaries object
 */

var olDictionaries = {
    Dictionaries : {
        ElAccessType : function(id, name, indexSpecified) {
            if (indexSpecified)
                return 'byIndex';
            if (id)
                return 'byID';
            if (name)
                return 'byName';
            return 'other';
        },
        ElElementType : function(elementTypeSpecified, elementType) {
            if (!elementTypeSpecified) {
                return 'Input';
            } else {
                switch (elementType) {
                case 0:
                    return 'RadioCheck';
                case 1:
                    return 'Select';
                case 2:
                    return 'Input';
                case 3:
                    return 'Submit';
                default:
                    return 'Input';
                }
            }
        },
        ElType : function(type) {
            switch (type) {
            case 0:
                return 'Plain';
            case 1:
                return 'Secure';
            case 2:
                return 'Matter';
            case 3:
                return 'Custom';
            case 4:
                return 'TimeKeeper';
            case 5:
                return 'Comment';
            default:
                return 'Plain';
            }
        },
        FormAccessType : function(id, name, indexSpecified) {
            if (indexSpecified)
                return 'byIndex';
            if (id)
                return 'byID';
            if (name)
                return 'byName';

            return 'byID';
        },
        InputReplacementType : function(element) {
            if (element.InputReplacementTypeSpecified) {
                switch (element.InputReplacementType) {
                case 0:
                    return 'Input';
                case 1:
                    return 'TrackOnly';
                case 2:
                    return 'ReplaceOnly';
                default:
                    return 'Input';
                }
            } else {
                return 'Input';
            }
        }
    }
};
